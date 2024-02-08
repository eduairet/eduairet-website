export class Dictionary {
  nav: { menu: string; home: string; contact: string };
  footer: {
    social: {
      ariaLabel: string;
    };
    theme: {
      ariaLabel: string;
      text: string;
    };
  };
  meta: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
  home: {
    subtitle: string;
    text: string;
  };
  client: {
    nav: {
      langs: {
        en: string;
        es: string;
      };
    };
    langsButton: {
      title: string;
      ariaLabel: string;
    };
    themeButton: {
      title: string;
      ariaLabel: string;
    };
  };

  constructor(data: Partial<Dictionary> = {}) {
    this.nav = data.nav || { menu: '', home: '', contact: '' };
    this.footer = {
      social: {
        ariaLabel: data.footer?.social?.ariaLabel || '',
      },
      theme: {
        ariaLabel: data.footer?.theme?.ariaLabel || '',
        text: data.footer?.theme?.text || '',
      },
    };
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
    this.home = {
      subtitle: data.home?.subtitle || '',
      text: data.home?.text || '',
    };
    this.client = {
      nav: {
        langs: {
          en: data.client?.nav?.langs?.en || '',
          es: data.client?.nav?.langs?.es || '',
        },
      },
      langsButton: {
        title: data.client?.langsButton?.title || '',
        ariaLabel: data.client?.langsButton?.ariaLabel || '',
      },
      themeButton: {
        title: data.client?.themeButton?.title || '',
        ariaLabel: data.client?.themeButton?.ariaLabel || '',
      },
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
