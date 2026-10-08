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

const submit = () =>
  POST(
    new Request('https://www.eduairet.com/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        locale: 'en',
        name: 'Test Person',
        email: 'test@example.test',
        message: 'Hello from the contact API test.',
        recaptchaToken: 'token-123',
      }),
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

  test('sends the email for a trusted token', async () => {
    googleReplies(trusted);
    const res = await submit();

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
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
