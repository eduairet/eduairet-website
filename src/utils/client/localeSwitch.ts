// React can't animate a root layout swap, so a language switch fades the page.
let settle: (() => void) | null = null;
const SETTLE_TIMEOUT_MS = 1500;

export const canAnimateLocaleSwitch = () =>
  typeof document !== 'undefined' && !!document.startViewTransition;

export function switchLocaleWithTransition(navigate: () => void) {
  document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        settle = resolve;
        navigate();
        // In case the new locale never renders, the page still updates.
        setTimeout(resolve, SETTLE_TIMEOUT_MS);
      })
  );
}

export function localeSwitched() {
  settle?.();
  settle = null;
}
