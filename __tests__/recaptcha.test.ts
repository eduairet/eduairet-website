import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// The site key is read when the module loads, so each test imports it fresh.
const importHook = async () => {
  vi.resetModules();
  return import('@/hooks/useRecaptcha');
};

const scripts = () =>
  [...document.querySelectorAll('script')].filter((s) =>
    s.src.startsWith('https://www.google.com/recaptcha/api.js')
  );

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_RECAPTCHA_SITE_KEY', 'site-key');
});

afterEach(() => {
  scripts().forEach((s) => s.remove());
  vi.unstubAllEnvs();
  // @ts-expect-error test cleanup of the global set by the stub
  delete window.grecaptcha;
});

describe('useRecaptcha', () => {
  test('adds no script until the form is used', async () => {
    const { default: useRecaptcha } = await importHook();
    renderHook(() => useRecaptcha());

    expect(scripts()).toHaveLength(0);
  });

  test('loads the script once and resolves when reCAPTCHA is ready', async () => {
    const { loadRecaptcha } = await importHook();
    const first = loadRecaptcha();
    const second = loadRecaptcha();

    expect(second).toBe(first);
    expect(scripts()).toHaveLength(1);
    expect(scripts()[0].src).toBe(
      'https://www.google.com/recaptcha/api.js?render=site-key'
    );

    window.grecaptcha = {
      ready: (callback: () => void) => callback(),
    } as typeof window.grecaptcha;
    scripts()[0].dispatchEvent(new Event('load'));
    await expect(first).resolves.toBeUndefined();
  });

  test('a token is requested at submit, after the script loads', async () => {
    const { default: useRecaptcha } = await importHook();
    const execute = vi.fn().mockResolvedValue('fresh-token');
    const { result } = renderHook(() => useRecaptcha());

    const token = result.current.getRecaptchaToken();
    window.grecaptcha = {
      ready: (callback: () => void) => callback(),
      execute,
    } as unknown as typeof window.grecaptcha;
    scripts()[0].dispatchEvent(new Event('load'));

    await expect(token).resolves.toBe('fresh-token');
    expect(execute).toHaveBeenCalledWith('site-key', expect.any(Object));
  });

  test('a failed load returns no token and lets the next try reload', async () => {
    const { default: useRecaptcha } = await importHook();
    const { result } = renderHook(() => useRecaptcha());

    const token = result.current.getRecaptchaToken();
    scripts()[0].dispatchEvent(new Event('error'));

    await expect(token).resolves.toBeNull();
    expect(scripts()).toHaveLength(0);
    result.current.loadRecaptcha().catch(() => {});
    expect(scripts()).toHaveLength(1);
  });
});
