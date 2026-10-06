import { ContactFormErrors } from '@/models';

interface Button {
  title: string;
  ariaLabel: string;
}

interface ThemeButton {
  title: string;
  toLight: string;
  toDark: string;
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
    skip: string;
    langs: {
      [key: string]: string;
    };
  };
  footer: {
    social: {
      ariaLabel: string;
      email: string;
    };
    theme: {
      text: string;
    };
  };
  buttons: {
    langsButton: Button;
    themeButton: ThemeButton;
  };
  home: {
    subtitle: string;
    summary: string;
    scrollCue: string;
    techStack: string;
    newTab: string;
  };
  experience: Section;
  projects: Section;
  education: Section;
  resources: {
    title: string;
    text: string;
  };
  notFound: {
    title: string;
  };
  status: {
    loading: string;
  };
  contact: {
    title: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      success: string;
      sending: string;
      required: string;
      lengthHint: string;
      recaptcha: {
        text: string;
        privacy: string;
        terms: string;
      };
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
      resources: {
        title: data.meta?.resources?.title || '',
        description: data.meta?.resources?.description || '',
      },
      notFound: {
        title: data.meta?.notFound?.title || '',
        description: data.meta?.notFound?.description || '',
      },
    };
    this.nav = data.nav || {
      menu: '',
      home: '',
      contact: '',
      skip: '',
      langs: {
        en: '',
        es: '',
      },
    };
    this.footer = {
      social: {
        ariaLabel: data.footer?.social?.ariaLabel || '',
        email: data.footer?.social?.email || '',
      },
      theme: {
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
        toLight: data.buttons?.themeButton?.toLight || '',
        toDark: data.buttons?.themeButton?.toDark || '',
      },
    };
    this.home = {
      subtitle: data.home?.subtitle || '',
      summary: data.home?.summary || '',
      scrollCue: data.home?.scrollCue || '',
      techStack: data.home?.techStack || '',
      newTab: data.home?.newTab || '',
    };
    this.experience = toSection(data.experience);
    this.projects = toSection(data.projects);
    this.education = toSection(data.education);
    this.resources = {
      title: data.resources?.title || '',
      text: data.resources?.text || '',
    };
    this.notFound = {
      title: data.notFound?.title || '',
    };
    this.status = {
      loading: data.status?.loading || '',
    };
    this.contact = {
      title: data.contact?.title || '',
      form: {
        name: data.contact?.form?.name || '',
        email: data.contact?.form?.email || '',
        message: data.contact?.form?.message || '',
        submit: data.contact?.form?.submit || '',
        success: data.contact?.form?.success || '',
        sending: data.contact?.form?.sending || '',
        required: data.contact?.form?.required || '',
        lengthHint: data.contact?.form?.lengthHint || '',
        recaptcha: {
          text: data.contact?.form?.recaptcha?.text || '',
          privacy: data.contact?.form?.recaptcha?.privacy || '',
          terms: data.contact?.form?.recaptcha?.terms || '',
        },
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
