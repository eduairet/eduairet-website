// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { sendEmail } from '@/services/server/email.service';

const fetchMock = vi.fn();
const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

// AWS's published example credentials, not real ones.
const env = {
  SES_REGION: 'us-east-1',
  SES_ACCESS_KEY_ID: 'AKIDEXAMPLE',
  SES_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
  CONTACT_EMAIL: 'me@example.test',
};

const visitor = {
  email: 'visitor@example.test',
  name: 'Ada Lovelace',
  message: 'Hello, I would like to talk about a project.',
};

const send = (locale: 'en' | 'es' = 'en', name = visitor.name) =>
  sendEmail(locale, visitor.email, name, visitor.message);

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
    expect(init.headers.authorization).toMatch(
      /^AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE\/\d{8}\/us-east-1\/ses\/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=[0-9a-f]{64}$/
    );
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

  test('missing SES settings fail without calling SES', async () => {
    vi.stubEnv('SES_SECRET_ACCESS_KEY', '');

    expect((await send()).success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
