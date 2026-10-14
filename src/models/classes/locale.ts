import { ContactFormErrors } from '@/models';

interface Button {
  title: string;
  ariaLabel: string;
}

interface ThemeButton {
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

interface PageMeta {
  title: string;
  description: string;
}

// A string is a paragraph; an array of strings is a list.
type PrivacyBlock = string | string[];

interface PrivacySection {
  id: string;
  title: string;
  body: PrivacyBlock[];
}

const toPageMeta = (data?: Partial<PageMeta>): PageMeta => ({
  title: data?.title || '',
  description: data?.description || '',
});

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
    home: PageMeta;
    contact: PageMeta;
    resources: PageMeta;
    privacy: PageMeta;
    notFound: PageMeta;
    ogImageAlt: string;
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
    privacy: string;
    credits: string;
  };
  buttons: {
    langsButton: Button;
    themeButton: ThemeButton;
    closeToast: string;
  };
  home: {
    subtitle: string;
    summary: string;
    scrollCue: string;
    techStack: string;
    newTab: string;
  };
  about: {
    title: string;
    text: string;
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
  contact: {
    title: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      success: string;
      sending: string;
      instructions: string;
      lengthHint: string;
      notice: string;
      noticeLink: string;
      privacyCheck: string;
      recaptcha: string;
      errors: {
        submit: string;
        privacy: string;
        empty: ContactFormErrors;
        invalid: ContactFormErrors;
      };
    };
  };
  privacy: {
    title: string;
    updated: string;
    intro: string;
    links: Record<string, string>;
    sections: PrivacySection[];
  };

  constructor(data: Partial<Dictionary> = {}) {
    this.meta = {
      home: toPageMeta(data.meta?.home),
      contact: toPageMeta(data.meta?.contact),
      resources: toPageMeta(data.meta?.resources),
      privacy: toPageMeta(data.meta?.privacy),
      notFound: toPageMeta(data.meta?.notFound),
      ogImageAlt: data.meta?.ogImageAlt || '',
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
      privacy: data.footer?.privacy || '',
      credits: data.footer?.credits || '',
    };
    this.buttons = {
      langsButton: {
        title: data.buttons?.langsButton?.title || '',
        ariaLabel: data.buttons?.langsButton?.ariaLabel || '',
      },
      themeButton: {
        toLight: data.buttons?.themeButton?.toLight || '',
        toDark: data.buttons?.themeButton?.toDark || '',
      },
      closeToast: data.buttons?.closeToast || '',
    };
    this.home = {
      subtitle: data.home?.subtitle || '',
      summary: data.home?.summary || '',
      scrollCue: data.home?.scrollCue || '',
      techStack: data.home?.techStack || '',
      newTab: data.home?.newTab || '',
    };
    this.about = {
      title: data.about?.title || '',
      text: data.about?.text || '',
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
    this.contact = {
      title: data.contact?.title || '',
      form: {
        name: data.contact?.form?.name || '',
        email: data.contact?.form?.email || '',
        message: data.contact?.form?.message || '',
        submit: data.contact?.form?.submit || '',
        success: data.contact?.form?.success || '',
        sending: data.contact?.form?.sending || '',
        instructions: data.contact?.form?.instructions || '',
        lengthHint: data.contact?.form?.lengthHint || '',
        notice: data.contact?.form?.notice || '',
        noticeLink: data.contact?.form?.noticeLink || '',
        privacyCheck: data.contact?.form?.privacyCheck || '',
        recaptcha: data.contact?.form?.recaptcha || '',
        errors: {
          submit: data.contact?.form?.errors?.submit || '',
          privacy: data.contact?.form?.errors?.privacy || '',
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
    this.privacy = {
      title: data.privacy?.title || '',
      updated: data.privacy?.updated || '',
      intro: data.privacy?.intro || '',
      links: data.privacy?.links || {},
      sections: data.privacy?.sections || [],
    };
  }
}

// The part of the dictionary that client components read. Long page copy
// stays on the server, so the browser gets one small set of UI strings.
const UI_KEYS = [
  'meta',
  'nav',
  'buttons',
  'home',
  'notFound',
  'contact',
] as const;

export type UiContent = Pick<Dictionary, (typeof UI_KEYS)[number]>;

export const toUiContent = (content: Dictionary) =>
  Object.fromEntries(UI_KEYS.map((key) => [key, content[key]])) as UiContent;
