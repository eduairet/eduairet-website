import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import HamburgerButton from '@/components/ui/Buttons/HamburgerButton/HamburgerButton';

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

let frames: FrameRequestCallback[] = [];
const runFrame = (time: number) => {
  const pending = frames;
  frames = [];
  act(() => pending.forEach((frame) => frame(time)));
};

beforeEach(() => {
  frames = [];
  vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((frame) => {
    frames.push(frame);
    return frames.length;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const renderButton = (isActive: boolean) => (
  <LanguageProvider>
    <HamburgerButton isActive={isActive} controls='menu' onClick={() => {}} />
  </LanguageProvider>
);

describe('HamburgerButton', () => {
  test('morphs the lines into an X over 0.3 s', () => {
    const { container, rerender } = render(renderButton(false));
    const [top, , bottom] = container.querySelectorAll('path');
    expect(top.getAttribute('d')).toBe('M5 8L25 8');
    expect(frames).toHaveLength(0);

    rerender(renderButton(true));
    runFrame(150);
    const halfway = top.getAttribute('d') ?? '';
    expect(halfway).not.toBe('M5 8L25 8');
    expect(halfway).not.toBe('M5 5L25 25');

    runFrame(300);
    expect(top.getAttribute('d')).toBe('M5 5L25 25');
    expect(bottom.getAttribute('d')).toBe('M5 25L25 5');
    expect(frames).toHaveLength(0);
  });
});
