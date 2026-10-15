// Mirrors $breakpoint-md in _breakpoints.scss; __tests__/breakpoints.test.ts keeps it in sync.
export const Breakpoints = {
  md: 768,
};

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// The phone layout. max-width, not range syntax, for Safari before 16.4.
export const PHONE_QUERY = `(max-width: ${Breakpoints.md - 0.02}px)`;
