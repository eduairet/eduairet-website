interface Button {
  title: string;
  ariaLabel: string;
}

export class Dictionary {
  meta: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
  nav: {
    menu: string;
    home: string;
    contact: string;
    langs: {
      [key: string]: string;
    };
  };
  footer: {
    social: {
      ariaLabel: string;
    };
    theme: {
      ariaLabel: string;
      text: string;
    };
  };
  buttons: {
    langsButton: Button;
    themeButton: Button;
  };
  home: {
    subtitle: string;
  };

  constructor(data: Partial<Dictionary> = {}) {
    this.meta = {
      default: {
        title: data.meta?.default?.title || '',
        description: data.meta?.default?.description || '',
      },
      contact: {
        title: data.meta?.contact?.title || '',
        description: data.meta?.contact?.description || '',
      },
    };
    this.nav = data.nav || {
      menu: '',
      home: '',
      contact: '',
      langs: {
        en: '',
        es: '',
      },
    };
    this.footer = {
      social: {
        ariaLabel: data.footer?.social?.ariaLabel || '',
      },
      theme: {
        ariaLabel: data.footer?.theme?.ariaLabel || '',
        text: data.footer?.theme?.text || '',
      },
    };
    this.buttons = {
      langsButton: {
        title: data.buttons?.langsButton?.title || '',
        ariaLabel: data.buttons?.langsButton?.ariaLabel || '',
      },
      themeButton: {
        title: data.buttons?.themeButton?.title || '',
        ariaLabel: data.buttons?.themeButton?.ariaLabel || '',
      },
    };
    this.home = {
      subtitle: data.home?.subtitle || '',
    };
  }

  getValue(key: string): any {
    const keys = key.split('.');
    let value: any = this;
    for (const prop of keys) {
      value = value?.[prop];
      if (value === undefined) return undefined;
    }
    return value;
  }
}
