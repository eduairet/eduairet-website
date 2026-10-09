export const THEME_STORAGE_KEY = 'theme';

// Runs before the body paints, so a light theme never flashes dark first.
// Same rule as useDarkMode: the saved choice, else the OS preference.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.body.setAttribute('data-theme',t)}catch(e){}`;
