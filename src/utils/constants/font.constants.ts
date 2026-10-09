export const degular = {
  wght: {
    min: 200,
    max: 800,
  },
  opsz: {
    min: 6,
    max: 72,
  },
  ital: {
    min: 0,
    max: 1,
  },
};

export const TYPEKIT_URL = process.env.NEXT_PUBLIC_TYPEKIT ?? '';

// Adds the Adobe Fonts stylesheet from a script, so it never blocks the
// first paint; the Degular fallback keeps the text in place until it loads.
export const TYPEKIT_LOADER = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(
  TYPEKIT_URL
).replace(/</g, '\\u003c')};document.head.appendChild(l)})()`;
