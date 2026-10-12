'use client';

import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react';
import { PHONE_QUERY } from '@/utils/constants';

// A click from Enter or Space has no click count.
const isKeyboardClick = (e: MouseEvent) => e.detail === 0;

// Makes everything outside `keep` inert, and returns a function that undoes it.
function inertOutside(keep: Element) {
  const madeInert: Element[] = [];
  for (let el = keep; el.parentElement && el !== document.body;) {
    for (const sibling of el.parentElement.children) {
      if (sibling === el || sibling.hasAttribute('inert')) continue;
      sibling.setAttribute('inert', '');
      madeInert.push(sibling);
    }
    el = el.parentElement;
  }
  return () => madeInert.forEach((el) => el.removeAttribute('inert'));
}

// APG disclosure pattern, or with `dialogOnPhone` the modal dialog pattern on phones.
export default function useNavMenu(
  isOpen: boolean,
  close: () => void,
  dialogOnPhone = false
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openedByKeyboard = useRef(false);
  const isModal =
    isOpen && dialogOnPhone && window.matchMedia(PHONE_QUERY).matches;

  // Shows the focus ring only after keyboard use, not after a tap or click.
  const focusToggle = (fromKeyboard: boolean) => {
    wrapperRef.current
      ?.querySelector<HTMLButtonElement>('button')
      ?.focus({ focusVisible: fromKeyboard });
  };

  const closeOnLayoutChange = useEffectEvent(() => {
    close();
    focusToggle(false);
  });

  // Crossing the breakpoint swaps the layout under an open menu, so close it.
  useEffect(() => {
    if (!isOpen) return;
    const query = window.matchMedia(PHONE_QUERY);
    const onChange = () => closeOnLayoutChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [isOpen]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!isModal || !wrapper) return;
    const restoreOutside = inertOutside(wrapper);
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    wrapper
      .querySelector<HTMLAnchorElement>('a[href]')
      ?.focus({ focusVisible: openedByKeyboard.current });
    return () => {
      restoreOutside();
      root.style.overflow = overflow;
    };
  }, [isModal]);

  const keepFocusInside = (e: KeyboardEvent<HTMLDivElement>) => {
    const items =
      e.currentTarget.querySelectorAll<HTMLElement>('a[href], button');
    const first = items[0];
    const last = items[items.length - 1];
    if (document.activeElement !== (e.shiftKey ? first : last)) return;
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    if (e.key === 'Tab' && isModal) keepFocusInside(e);
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    close();
    focusToggle(true);
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!isOpen || isModal) return;
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    close();
  };

  const onClickCapture = (e: MouseEvent) => {
    openedByKeyboard.current = isKeyboardClick(e);
  };

  // A chosen link hides with the menu, so move focus back to the toggle.
  // In the dialog, other clicks (the theme button, empty space) keep it open.
  const onLinkClick = (e: MouseEvent) => {
    if (isModal && !(e.target as Element).closest('a')) return;
    close();
    focusToggle(isKeyboardClick(e));
  };

  return {
    wrapperProps: { ref: wrapperRef, onKeyDown, onBlur, onClickCapture },
    onLinkClick,
    isModal,
  };
}
