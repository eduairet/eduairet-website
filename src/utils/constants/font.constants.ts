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

const typekitHref = JSON.stringify(TYPEKIT_URL).replace(/</g, '\\u003c');

// Inject Adobe Fonts CSS after first paint, in syntax every browser parses, so it is not render-blocking.
function loadTypekit(href: string) {
  function load() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  var types =
    (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes) ||
    [];
  if (types.indexOf('paint') < 0) {
    addEventListener('load', load);
    return;
  }
  new PerformanceObserver(function (list, observer) {
    if (list.getEntriesByName('first-contentful-paint').length) {
      observer.disconnect();
      load();
    }
  }).observe({ type: 'paint', buffered: true });
}

export const TYPEKIT_LOADER = `(${loadTypekit})(${typekitHref})`;
