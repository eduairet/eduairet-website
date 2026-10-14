'use client';

import {
  FocusEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
} from 'react';
import styles from './Toast.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import useToast from '@/hooks/useToast';
import IconButton from '@/components/ui/Buttons/IconButton/IconButton';

// Always rendered, so screen readers announce a toast; focus never moves.
export default function Toast() {
  const { content } = useContext(LanguageContext);
  const { toast, closeToast } = useToast();
  const toastRef = useRef<HTMLDivElement>(null);
  const focusBefore = useRef<HTMLElement | null>(null);
  const isOpen = toast !== null;

  // Focused fields scroll clear of the open toast (WCAG 2.4.11).
  useEffect(() => {
    const box = toastRef.current;
    if (!isOpen || !box) return;
    const root = document.documentElement.style;
    const update = () =>
      root.setProperty(
        '--toast-bottom',
        `${box.getBoundingClientRect().bottom}px`
      );
    // A breakpoint can move the toast without resizing it.
    const observer = new ResizeObserver(update);
    observer.observe(box);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      root.removeProperty('--toast-bottom');
    };
  }, [isOpen]);

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (!toastRef.current?.contains(e.relatedTarget)) {
      focusBefore.current = e.relatedTarget as HTMLElement | null;
    }
  };

  // The close button is about to disappear, so focus goes back where it was.
  const close = () => {
    if (!isOpen) return;
    if (toastRef.current?.contains(document.activeElement)) {
      focusBefore.current?.focus();
    }
    closeToast(toast.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') close();
  };

  return (
    <div
      ref={toastRef}
      className={[styles.toast, isOpen ? styles.open : ''].join(' ')}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    >
      <p role='status' className={styles.message}>
        {isOpen && <span key={toast.id}>{toast.message}</span>}
      </p>
      {isOpen && (
        <IconButton title={content.buttons.closeToast} onClick={close} bare>
          <path d='M20 12L50 42L80 12L88 20L58 50L88 80L80 88L50 58L20 88L12 80L42 50L12 20Z' />
        </IconButton>
      )}
    </div>
  );
}
