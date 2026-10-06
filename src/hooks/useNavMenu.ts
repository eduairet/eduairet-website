'use client';

import { FocusEvent, KeyboardEvent, useRef } from 'react';

// Disclosure behaviour for the nav dropdowns (WAI-ARIA APG disclosure pattern):
// Escape closes and returns focus to the toggle, and the menu closes when
// focus leaves it.
export default function useNavMenu(isOpen: boolean, close: () => void) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const focusToggle = () => {
    wrapperRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !isOpen) return;
    e.stopPropagation();
    close();
    focusToggle();
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    close();
  };

  // A chosen link hides with the menu, so move focus back to the toggle.
  const onLinkClick = () => {
    close();
    focusToggle();
  };

  return { wrapperProps: { ref: wrapperRef, onKeyDown, onBlur }, onLinkClick };
}
