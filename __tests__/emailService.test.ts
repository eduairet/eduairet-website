// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { sendEmail } from '@/services/server/email.service';
import { assumeRoleWithWebIdentity } from '@/utils/server';

vi.mock('@/utils/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/server')>()),
  assumeRoleWithWebIdentity: vi.fn(),
}));

const fetchMock = vi.fn();
const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

const env = {
  SES_REGION: 'us-east-1',
  SES_ROLE_ARN: 'arn:aws:iam::123456789012:role/example',
  CONTACT_EMAIL: 'me@example.test',
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
});

afterEach(() => {
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
