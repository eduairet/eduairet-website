'use client';

import { FocusEvent, KeyboardEvent, MouseEvent, useRef } from 'react';

// WAI-ARIA APG disclosure pattern for the nav dropdowns.
export default function useNavMenu(isOpen: boolean, close: () => void) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Shows the focus ring only after keyboard use, not after a tap or click.
  const focusToggle = (fromKeyboard: boolean) => {
    wrapperRef.current
      ?.querySelector<HTMLButtonElement>('button')
      ?.focus({ focusVisible: fromKeyboard });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !isOpen) return;
    e.stopPropagation();
    close();
    focusToggle(true);
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    close();
  };

  // A chosen link hides with the menu, so move focus back to the toggle.
  // A click from Enter or Space has no click count.
  const onLinkClick = (e: MouseEvent) => {
    close();
    focusToggle(e.detail === 0);
  };

  return { wrapperProps: { ref: wrapperRef, onKeyDown, onBlur }, onLinkClick };
}
