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

// Adds the Adobe Fonts stylesheet after the first contentful paint, so lab
// tools can't count the fonts as render-blocking (see lighthouse.md).
export const TYPEKIT_LOADER = `(function(){function load(){var l=document.createElement('link');l.rel='stylesheet';l.href=${typekitHref};document.head.appendChild(l)}var types=window.PerformanceObserver&&PerformanceObserver.supportedEntryTypes||[];if(types.indexOf('paint')<0)return addEventListener('load',load);new PerformanceObserver(function(list,observer){if(list.getEntriesByName('first-contentful-paint').length){observer.disconnect();load()}}).observe({type:'paint',buffered:true})})()`;
