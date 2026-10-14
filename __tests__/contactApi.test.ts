// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { sendEmail } from '@/services/server/email.service';

vi.mock('@/services/server/email.service', () => ({
  sendEmail: vi.fn(async () => ({ success: true, message: 'ok', status: 200 })),
}));

const fetchMock = vi.fn();

const trusted = {
  success: true,
  score: 0.9,
  action: 'submit',
  hostname: 'www.eduairet.com',
};

const validBody = JSON.stringify({
  locale: 'en',
  name: 'Test Person',
  email: 'test@example.test',
  message: 'Hello from the contact API test.',
  recaptchaToken: 'token-123',
  privacyRead: true,
});

const sentFields = [
  'en',
  'test@example.test',
  'Test Person',
  'Hello from the contact API test.',
];

const submit = (body = validBody, headers: Record<string, string> = {}) =>
  POST(
    new Request('https://www.eduairet.com/api/contact', {
      method: 'POST',
      body,
      headers,
    })
  );

const googleReplies = (body: object) =>
  fetchMock.mockResolvedValue(new Response(JSON.stringify(body)));

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('RECAPTCHA_SECRET_KEY', 'test-secret');
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('POST /api/contact', () => {
  test('sends the secret and token in the body, not the URL', async () => {
    googleReplies(trusted);
    await submit();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://www.google.com/recaptcha/api/siteverify');
    const body = new URLSearchParams(init.body.toString());
    expect(body.get('secret')).toBe('test-secret');
    expect(body.get('response')).toBe('token-123');
  });

  test('a high score sends the email with a confirmation', async () => {
    googleReplies(trusted);
    const res = await submit();

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledWith(
      ...sentFields,
      expect.objectContaining({ sendConfirmation: true })
    );
  });

  test('a passing but lower score answers the same, with no confirmation', async () => {
    googleReplies({ ...trusted, score: 0.7 });
    const res = await submit();

    expect(res.status).toBe(200);
    expect(await res.json()).toBe('Email sent successfully!');
    expect(sendEmail).toHaveBeenCalledWith(
      ...sentFields,
      expect.objectContaining({ sendConfirmation: false })
    );
  });

  test("passes Vercel's OIDC token on to the email service", async () => {
    googleReplies(trusted);
    await submit(validBody, { 'x-vercel-oidc-token': 'oidc-token' });

    expect(sendEmail).toHaveBeenCalledWith(
      ...sentFields,
      expect.objectContaining({ oidcToken: 'oidc-token' })
    );
  });

  test('answers a failed send with 500', async () => {
    googleReplies(trusted);
    vi.mocked(sendEmail).mockResolvedValueOnce({
      success: false,
      message: 'There was an error sending the email',
      status: 500,
    });
    const res = await submit();

    expect(res.status).toBe(500);
  });

  test('answers a malformed body with 400', async () => {
    const res = await submit('not json');

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each(['locale', 'name', 'email', 'message', 'recaptchaToken'])(
    'answers a non-string %s with 400',
    async (field) => {
      for (const value of [42, ['x'], { x: 1 }, null]) {
        const body = { ...JSON.parse(validBody), [field]: value };
        const res = await submit(JSON.stringify(body));

        expect(res.status).toBe(400);
        expect(await res.text()).toBe('Bad Request');
      }
      expect(fetchMock).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    }
  );

  test('answers a send without the privacy box ticked with 400', async () => {
    for (const value of [false, 'true', 1, null, undefined]) {
      const body = { ...JSON.parse(validBody), privacyRead: value };
      const res = await submit(JSON.stringify(body));

      expect(res.status).toBe(400);
      expect(await res.text()).toBe('Bad Request');
    }
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  test.each([
    ['a failed check', { success: false }],
    ['a low score', { score: 0.1 }],
    ['another action', { action: 'login' }],
    ['another hostname', { hostname: 'attacker.example' }],
  ])('rejects %s', async (_, override) => {
    googleReplies({ ...trusted, ...override });
    const res = await submit();

    expect(res.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
