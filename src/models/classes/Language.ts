interface IThemeButton {
  ariaLabel: string;
}

export class LanguageClientContent {
  themeButton: IThemeButton = { ariaLabel: 'Change Theme Button' };

  constructor(content?: any) {
    if (content) Object.assign(this, content);
  }
}
