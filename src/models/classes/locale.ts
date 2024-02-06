interface IButton {
  title: string;
  ariaLabel: string;
}

interface INav {
  langs: {
    en: string;
    es: string;
  };
}

export class LanguageClientContent {
  nav: INav = { langs: { en: 'English', es: 'Spanish' } };
  langsButton: IButton = {
    title: 'Languages',
    ariaLabel: 'Language Select Button',
  };
  themeButton: IButton = { title: 'Theme', ariaLabel: 'Toggle Theme Button' };

  constructor(content?: any) {
    if (content) Object.assign(this, content);
  }
}
