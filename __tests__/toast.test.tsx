import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { ToastProvider } from '@/store/ToastProvider';
import useToast from '@/hooks/useToast';
import Toast from '@/components/ui/Toast/Toast';
import { Dictionary, EnContent, EsContent } from '@/models';
import { stubResizeObserver } from './helpers/resizeObserver';

const ShowButton = ({ message }: { message: string }) => {
  const { showToast } = useToast();
  return (
    <button type='button' onClick={() => showToast(message)}>
      Show
    </button>
  );
};

const renderToast = (
  content = new Dictionary(EnContent),
  children: ReactNode = <ShowButton message='Saved!' />
) =>
  render(
    <LanguageProvider locale='en' content={content}>
      <ToastProvider>
        <Toast />
        {children}
      </ToastProvider>
    </LanguageProvider>
  );

const show = () => {
  const button = screen.getByRole('button', { name: 'Show' });
  button.focus();
  fireEvent.click(button);
  return button;
};

beforeEach(stubResizeObserver);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Toast', () => {
  test('the status region is in the page before any toast', () => {
    renderToast();
    expect(screen.getByRole('status').textContent).toBe('');
    expect(screen.queryByRole('button', { name: 'Close notice' })).toBeNull();
  });

  test('showing a toast puts its text in the status region and keeps focus', () => {
    renderToast();
    const button = show();

    expect(screen.getByRole('status').textContent).toBe('Saved!');
    expect(document.activeElement).toBe(button);
  });

  test('the close button has a localized name', () => {
    renderToast(new Dictionary(EsContent));
    show();
    expect(screen.getByRole('button', { name: 'Cerrar aviso' })).toBeTruthy();
  });

  test('the close button removes it and returns focus', () => {
    renderToast();
    const button = show();
    const close = screen.getByRole('button', { name: 'Close notice' });
    close.focus();

    fireEvent.click(close);

    expect(screen.getByRole('status').textContent).toBe('');
    expect(document.activeElement).toBe(button);
  });

  test('Escape removes it while focus is inside', () => {
    renderToast();
    show();
    const close = screen.getByRole('button', { name: 'Close notice' });
    close.focus();

    fireEvent.keyDown(close, { key: 'Escape' });

    expect(screen.getByRole('status').textContent).toBe('');
  });

  test('closing an older toast leaves a newer one open', () => {
    let firstId = 0;
    const Producer = () => {
      const { showToast, closeToast } = useToast();
      return (
        <>
          <button type='button' onClick={() => (firstId = showToast('One'))}>
            First
          </button>
          <button type='button' onClick={() => showToast('Two')}>
            Second
          </button>
          <button type='button' onClick={() => closeToast(firstId)}>
            Close first
          </button>
        </>
      );
    };
    renderToast(undefined, <Producer />);

    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close first' }));

    expect(screen.getByRole('status').textContent).toBe('Two');
  });

  test('it does not close on a timer', () => {
    vi.useFakeTimers();
    renderToast();
    show();

    act(() => vi.advanceTimersByTime(30000));

    expect(screen.getByRole('status').textContent).toBe('Saved!');
  });
});
