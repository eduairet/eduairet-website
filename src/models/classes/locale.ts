import { ContactFormErrors } from '@/models';

interface Button {
  title: string;
  ariaLabel: string;
}

export interface SectionEntry {
  role: string;
  roleUrl?: string;
  company: string;
  companyUrl: string;
  meta: string;
  period: string;
  description: string;
  stack: string[];
}

interface Section {
  title: string;
  items: SectionEntry[];
}

const toSection = (data?: Partial<Section>): Section => ({
  title: data?.title || '',
  items: (data?.items || []).map((item) => ({
    role: item.role || '',
    roleUrl: item.roleUrl || '',
    company: item.company || '',
    companyUrl: item.companyUrl || '',
    meta: item.meta || '',
    period: item.period || '',
    description: item.description || '',
    stack: item.stack || [],
  })),
});

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
    summary: string;
    scrollCue: string;
  };
  experience: Section;
  projects: Section;
  education: Section;
  contact: {
    title: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      success: string;
      errors: {
        submit: string;
        empty: ContactFormErrors;
        invalid: ContactFormErrors;
      };
    };
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
      summary: data.home?.summary || '',
      scrollCue: data.home?.scrollCue || '',
    };
    this.experience = toSection(data.experience);
    this.projects = toSection(data.projects);
    this.education = toSection(data.education);
    this.contact = {
      title: data.contact?.title || '',
      form: {
        name: data.contact?.form?.name || '',
        email: data.contact?.form?.email || '',
        message: data.contact?.form?.message || '',
        submit: data.contact?.form?.submit || '',
        success: data.contact?.form?.success || '',
        errors: {
          submit: data.contact?.form?.errors?.submit || '',
          empty: {
            name: data.contact?.form?.errors?.empty?.name || '',
            email: data.contact?.form?.errors?.empty?.email || '',
            message: data.contact?.form?.errors?.empty?.message || '',
          },
          invalid: {
            name: data.contact?.form?.errors?.invalid?.name || '',
            email: data.contact?.form?.errors?.invalid?.email || '',
            message: data.contact?.form?.errors?.invalid?.message || '',
          },
        },
      },
    };
  }
}
