// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { after } from 'next/server';
import { Lang } from '@/models';
import { sendEmail } from '@/services/server/email.service';
import { assumeRoleWithWebIdentity, putDynamoDbItem } from '@/utils/server';

const afterTasks = vi.hoisted(() => [] as (() => unknown)[]);

vi.mock('next/server', () => ({
  after: vi.fn((task: () => unknown) => afterTasks.push(task)),
}));

vi.mock('@/utils/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/server')>()),
  assumeRoleWithWebIdentity: vi.fn(),
  putDynamoDbItem: vi.fn(),
}));

const finishResponse = () => Promise.all(afterTasks.splice(0).map((t) => t()));

const fetchMock = vi.fn();
const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

const env = {
  SES_REGION: 'us-east-1',
  SES_ROLE_ARN: 'arn:aws:iam::123456789012:role/example',
  CONTACT_EMAIL: 'me@example.test',
  CONTACT_TABLE: 'contact-messages',
  VERCEL_ENV: 'preview',
};

const temporaryCredentials = {
  accessKeyId: 'ASIAEXAMPLE',
  secretAccessKey: 'temporary-secret',
  sessionToken: 'session-token',
};

const visitor = {
  email: 'visitor@example.test',
  name: 'Ada Lovelace',
  message: 'Hello, I would like to talk about a project.',
};

const send = (locale: 'en' | 'es' = 'en', name = visitor.name) =>
  sendEmail(locale, visitor.email, name, visitor.message, {
    sendConfirmation: true,
    oidcToken: 'oidc-token',
  });

const sesReplies = (...responses: Response[]) =>
  responses.forEach((res) => fetchMock.mockResolvedValueOnce(res));

const ok = () => new Response(JSON.stringify({ MessageId: 'id' }));
const rejected = () =>
  new Response(
    JSON.stringify({
      message: `Email address is not verified: ${visitor.email}`,
    }),
    {
      status: 400,
      headers: { 'x-amzn-ErrorType': 'MessageRejected:http://internal' },
    }
  );

const sentEmail = (call: number) =>
  JSON.parse(fetchMock.mock.calls[call][1].body);

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  Object.entries(env).forEach(([name, value]) => vi.stubEnv(name, value));
  vi.mocked(assumeRoleWithWebIdentity).mockResolvedValue(temporaryCredentials);
  vi.mocked(putDynamoDbItem).mockResolvedValue(undefined);
});

afterEach(() => {
  afterTasks.length = 0;
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('sendEmail', () => {
  test('posts a signed request to SES v2', async () => {
    sesReplies(ok(), ok());
    await send();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://email.us-east-1.amazonaws.com/v2/email/outbound-emails'
    );
    expect(init.method).toBe('POST');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.headers['content-type']).toBe('application/json');
    expect(init.headers['x-amz-date']).toMatch(/^\d{8}T\d{6}Z$/);
    expect(init.headers['x-amz-security-token']).toBe('session-token');
    expect(init.headers.authorization).toMatch(
      /^AWS4-HMAC-SHA256 Credential=ASIAEXAMPLE\/\d{8}\/us-east-1\/ses\/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token, Signature=[0-9a-f]{64}$/
    );
  });

  test("assumes the role with the request's OIDC token", async () => {
    sesReplies(ok(), ok());
    await send();

    expect(assumeRoleWithWebIdentity).toHaveBeenCalledTimes(1);
    expect(assumeRoleWithWebIdentity).toHaveBeenCalledWith({
      region: env.SES_REGION,
      roleArn: env.SES_ROLE_ARN,
      sessionName: 'eduairet-website-contact',
      webIdentityToken: 'oidc-token',
    });
  });

  test('sends my copy first, with the visitor as Reply-To', async () => {
    sesReplies(ok(), ok());
    const result = await send();

    expect(result).toEqual({
      success: true,
      message: 'Email sent successfully',
      status: 200,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentEmail(0)).toEqual({
      FromEmailAddress: `Eduardo Aire Torres <${env.CONTACT_EMAIL}>`,
      Destination: { ToAddresses: [env.CONTACT_EMAIL] },
      ReplyToAddresses: [visitor.email],
      Content: {
        Simple: {
          Subject: {
            Data: `Message from ${visitor.name} (${visitor.email})`,
            Charset: 'UTF-8',
          },
          Body: { Text: { Data: visitor.message, Charset: 'UTF-8' } },
        },
      },
    });
  });

  test('without the confirmation flag, only my copy is sent', async () => {
    sesReplies(ok());
    const result = await sendEmail(
      'en',
      visitor.email,
      visitor.name,
      visitor.message,
      { oidcToken: 'oidc-token' }
    );

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentEmail(0).Destination.ToAddresses).toEqual([env.CONTACT_EMAIL]);
  });

  test('with the flag, my copy goes first and then the confirmation', async () => {
    sesReplies(ok(), ok());
    await send();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentEmail(0).Destination.ToAddresses).toEqual([env.CONTACT_EMAIL]);
    expect(sentEmail(1).Destination.ToAddresses).toEqual([visitor.email]);
  });

  test.each(['en', 'es'] as const)(
    'the %s confirmation holds nothing from the form',
    async (locale) => {
      sesReplies(ok(), ok());
      await send(locale);

      const confirmation = sentEmail(1);
      expect(confirmation.Destination.ToAddresses).toEqual([visitor.email]);
      expect(confirmation.ReplyToAddresses).toBeUndefined();
      const { Subject, Body } = confirmation.Content.Simple;
      for (const text of [Subject.Data, Body.Text.Data]) {
        expect(text).not.toContain(visitor.name);
        expect(text).not.toContain(visitor.email);
        expect(text).not.toContain(visitor.message);
      }
    }
  );

  test('a failed copy to me sends no confirmation and reports failure', async () => {
    sesReplies(rejected());
    const result = await send('es');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: false,
      message: 'Hubo un error al enviar el correo',
      status: 500,
    });
  });

  test('a failed confirmation still reports success', async () => {
    sesReplies(ok(), rejected());
    const result = await send();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.success).toBe(true);
  });

  test('a network error reports failure instead of throwing', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

    expect((await send()).success).toBe(false);
    expect(errorLog).toHaveBeenCalledWith('SES SendEmail failed: TypeError');
  });

  test('a line break in the name cannot reach the subject', async () => {
    sesReplies(ok(), ok());
    await send('en', 'Ada\r\nBcc: someone@example.test');

    expect(sentEmail(0).Content.Simple.Subject.Data).toBe(
      `Message from Ada Bcc: someone@example.test (${visitor.email})`
    );
  });

  // The SES reply names the visitor's address; only status and type may be logged.
  test('logs the status and error type, nothing personal or secret', async () => {
    sesReplies(rejected());
    await send();

    expect(errorLog).toHaveBeenCalledTimes(1);
    expect(errorLog).toHaveBeenCalledWith(
      'SES SendEmail failed: 400 MessageRejected'
    );
  });

  test('missing SES settings fail without calling AWS', async () => {
    vi.stubEnv('SES_ROLE_ARN', '');

    expect((await send()).success).toBe(false);
    expect(assumeRoleWithWebIdentity).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('without an OIDC token, nothing is sent', async () => {
    const result = await sendEmail(
      'en',
      visitor.email,
      visitor.name,
      visitor.message,
      { oidcToken: null }
    );

    expect(result.success).toBe(false);
    expect(errorLog).toHaveBeenCalledWith(
      'SES SendEmail failed: no Vercel OIDC token'
    );
    expect(assumeRoleWithWebIdentity).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('a refused role reports failure and sends nothing', async () => {
    vi.mocked(assumeRoleWithWebIdentity).mockRejectedValueOnce(
      new Error('403 AccessDenied')
    );

    expect((await send()).success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(errorLog).toHaveBeenCalledWith(
      'STS AssumeRoleWithWebIdentity failed: 403 AccessDenied'
    );
  });
});

const DAY = 24 * 60 * 60;
const savedItem = () => vi.mocked(putDynamoDbItem).mock.calls[0][0].item;

describe('sendEmail saves a backup of the message', () => {
  test('saves once, after the response, with only the agreed attributes', async () => {
    sesReplies(ok(), ok());
    await send();

    expect(putDynamoDbItem).not.toHaveBeenCalled();
    await finishResponse();

    expect(putDynamoDbItem).toHaveBeenCalledTimes(1);
    expect(putDynamoDbItem).toHaveBeenCalledWith(
      expect.objectContaining({
        region: env.SES_REGION,
        tableName: env.CONTACT_TABLE,
        credentials: temporaryCredentials,
      })
    );
    const item = savedItem();
    expect(Object.keys(item).sort()).toEqual([
      'createdAt',
      'email',
      'expiresAt',
      'id',
      'locale',
      'message',
      'name',
      'vercelEnv',
    ]);
    expect(item).toMatchObject({
      locale: { S: 'en' },
      name: { S: visitor.name },
      email: { S: visitor.email },
      message: { S: visitor.message },
      vercelEnv: { S: 'preview' },
    });
    expect(item.id).toEqual({ S: expect.stringMatching(/^[0-9a-f-]{36}$/) });
    expect(JSON.stringify(item)).not.toMatch(/oidc-token|session-token/);
    expect(assumeRoleWithWebIdentity).toHaveBeenCalledTimes(1);
  });

  test('the expiry is a Number in epoch seconds, 90 days after creation', async () => {
    sesReplies(ok(), ok());
    await send();
    await finishResponse();

    const { createdAt, expiresAt } = savedItem() as Record<
      string,
      Record<string, string>
    >;
    const created = Date.parse(createdAt.S) / 1000;
    expect(expiresAt.N).toMatch(/^\d+$/);
    expect(Number(expiresAt.N) - Math.floor(created)).toBe(90 * DAY);
    expect(Math.abs(created - Date.now() / 1000)).toBeLessThan(60);
  });

  test('stores the locale the email used, not the raw value', async () => {
    sesReplies(ok());
    await sendEmail(
      'xx' as Lang,
      visitor.email,
      visitor.name,
      visitor.message,
      {
        oidcToken: 'oidc-token',
      }
    );
    await finishResponse();

    expect(savedItem().locale).toEqual({ S: 'en' });
  });

  test('a failed save still sends my email and returns the same response', async () => {
    vi.mocked(putDynamoDbItem).mockRejectedValueOnce(
      new Error('400 ResourceNotFoundException')
    );
    sesReplies(ok(), ok());
    const result = await send();
    await finishResponse();

    expect(result).toEqual({
      success: true,
      message: 'Email sent successfully',
      status: 200,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(errorLog).toHaveBeenCalledWith(
      'DynamoDB PutItem failed: 400 ResourceNotFoundException'
    );
  });

  test('a failed email still keeps the saved message', async () => {
    sesReplies(rejected());
    const result = await send();
    await finishResponse();

    expect(result.success).toBe(false);
    expect(putDynamoDbItem).toHaveBeenCalledTimes(1);
    expect(savedItem().message).toEqual({ S: visitor.message });
  });

  test('without a table name, the email still goes and nothing is saved', async () => {
    vi.stubEnv('CONTACT_TABLE', '');
    sesReplies(ok(), ok());
    const result = await send();
    await finishResponse();

    expect(result.success).toBe(true);
    expect(putDynamoDbItem).not.toHaveBeenCalled();
    expect(errorLog).toHaveBeenCalledWith(
      'DynamoDB PutItem failed: missing CONTACT_TABLE'
    );
  });

  test('a refused role schedules no save', async () => {
    vi.mocked(assumeRoleWithWebIdentity).mockRejectedValueOnce(
      new Error('403 AccessDenied')
    );
    await send();

    expect(after).not.toHaveBeenCalled();
  });

  test('logs hold no name, email or message when both fail', async () => {
    vi.mocked(putDynamoDbItem).mockRejectedValueOnce(
      new Error('400 ValidationException')
    );
    sesReplies(rejected());
    await send();
    await finishResponse();

    expect(errorLog).toHaveBeenCalledTimes(2);
    for (const line of errorLog.mock.calls.flat().map(String)) {
      expect(line).not.toContain(visitor.name);
      expect(line).not.toContain(visitor.email);
      expect(line).not.toContain(visitor.message);
    }
  });
});
