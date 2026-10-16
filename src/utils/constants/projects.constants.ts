// Facts shared by both languages. The copy lives in the dictionaries, keyed by slug.

export type ProjectSlug =
  | 'eduardo-pavon'
  | 'font-proofer'
  | 'vibe-coded-torus'
  | 'letrastica-5'
  | 'the-session'
  | 'emoji-drop'
  | 'collectible-pleasures'
  | 'melvin-pay'
  | 'typefobia'
  | 'fontfactory'
  | 'interplanetary-fonts'
  | 'ascii-name-generator';

export type ProjectLinkKind =
  | 'live'
  | 'code'
  | 'generator'
  | 'course'
  | 'showcase'
  | 'accelerator'
  | 'appCode';

export type ProjectArt = 'letrastica' | 'torus' | 'waves' | 'ascii';

// How a shot is shown: in a browser window, in a phone, or as it is.
export type MediaFrame = 'browser' | 'phone' | 'plain';

export interface ProjectImage {
  kind: 'image';
  frame: MediaFrame;
  name: string;
  width: number;
  height: number;
  // Exported widths, largest first; files are `${name}-${width}.webp`.
  widths: number[];
}

export interface ProjectVideo {
  kind: 'video';
  frame: MediaFrame;
  name: string;
  width: number;
  height: number;
  // A demo has sound and controls; a clip is a short muted loop.
  demo?: boolean;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export interface Project {
  slug: ProjectSlug;
  // ISO dates: when the work began, and when this page's content last changed.
  started: string;
  updated: string;
  stack: string[];
  links: { kind: ProjectLinkKind; href: string }[];
  media: ProjectMedia[];
  art?: ProjectArt;
}

const desktop = (name: string): ProjectImage => ({
  kind: 'image',
  frame: 'browser',
  name,
  width: 1280,
  height: 800,
  widths: [1280, 640],
});

const phone = (name: string, widths = [390]): ProjectImage => ({
  kind: 'image',
  frame: 'phone',
  name,
  width: 390,
  height: 844,
  widths,
});

const slide = (name: string): ProjectImage => ({
  kind: 'image',
  frame: 'plain',
  name,
  width: 1280,
  height: 720,
  widths: [1280, 640],
});

const clip = (name = 'clip'): ProjectVideo => ({
  kind: 'video',
  frame: 'browser',
  name,
  width: 1280,
  height: 800,
});

const PROJECTS_UPDATED = '2026-10-15';

// Newest first.
export const PROJECTS: Project[] = [
  {
    slug: 'eduardo-pavon',
    started: '2026-09',
    updated: PROJECTS_UPDATED,
    stack: [
      'astro',
      'typescript',
      'tailwind',
      'docker',
      'vercel',
      'claudecode',
    ],
    links: [
      { kind: 'live', href: 'https://www.eduardopavon.co' },
      { kind: 'code', href: 'https://github.com/Edvardito/eduardopavon.co' },
    ],
    media: [desktop('home'), clip(), phone('phone')],
  },
  {
    slug: 'font-proofer',
    started: '2026-06',
    updated: PROJECTS_UPDATED,
    stack: ['python', 'docker', 'claudecode', 'html', 'css'],
    links: [
      { kind: 'code', href: 'https://github.com/eduairet/claude-font-proofer' },
    ],
    media: [slide('title'), slide('print'), slide('web')],
  },
  {
    slug: 'vibe-coded-torus',
    started: '2026-03',
    updated: PROJECTS_UPDATED,
    stack: ['rust', 'docker', 'claudecode'],
    links: [
      { kind: 'code', href: 'https://github.com/eduairet/vibe-coded-torus' },
    ],
    media: [],
    art: 'torus',
  },
  {
    slug: 'letrastica-5',
    started: '2024-04',
    updated: PROJECTS_UPDATED,
    stack: ['react', 'typescript', 'css'],
    links: [{ kind: 'live', href: 'https://letrastica-5-pocs.netlify.app' }],
    media: [{ ...desktop('desktop'), height: 600 }, phone('phone')],
    art: 'letrastica',
  },
  {
    slug: 'the-session',
    started: '2023-10',
    updated: PROJECTS_UPDATED,
    stack: ['nextjs', 'typescript', 'react', 'ethereum'],
    links: [
      { kind: 'live', href: 'https://the-session.vercel.app' },
      { kind: 'code', href: 'https://github.com/eduairet/eth-online-2023' },
    ],
    media: [clip(), desktop('groups'), phone('phone')],
  },
  {
    slug: 'emoji-drop',
    started: '2023-05',
    updated: PROJECTS_UPDATED,
    stack: ['react', 'typescript', 'motoko'],
    links: [
      { kind: 'live', href: 'https://siav5-oyaaa-aaaao-aspba-cai.icp0.io' },
      { kind: 'code', href: 'https://github.com/eduairet/emoji_drop' },
    ],
    media: [desktop('home'), phone('phone')],
  },
  {
    slug: 'collectible-pleasures',
    started: '2023-05',
    updated: PROJECTS_UPDATED,
    stack: [
      'nextjs',
      'typescript',
      'react',
      'tailwind',
      'ethereum',
      'p5',
      'javascript',
      'python',
      'solidity',
      'ipfs',
    ],
    links: [
      { kind: 'live', href: 'https://collectible-pleasures.vercel.app' },
      {
        kind: 'code',
        href: 'https://github.com/eduairet/collectible-pleasures',
      },
      {
        kind: 'generator',
        href: 'https://github.com/eduairet/collectible-pleasures-generator',
      },
      {
        kind: 'course',
        href: 'https://www.alchemy.com/university/projects/collectible-pleasures',
      },
    ],
    media: [desktop('home'), phone('phone')],
    art: 'waves',
  },
  {
    slug: 'melvin-pay',
    started: '2023-01',
    updated: PROJECTS_UPDATED,
    stack: ['angular', 'typescript', 'sass'],
    links: [],
    media: [
      clip(),
      desktop('income'),
      desktop('ticket'),
      phone('phone', [780, 390]),
    ],
  },
  {
    slug: 'typefobia',
    started: '2022-12',
    updated: PROJECTS_UPDATED,
    stack: ['nextjs', 'react', 'javascript', 'ethereum', 'solidity'],
    links: [
      { kind: 'live', href: 'https://www.typefobia.com' },
      { kind: 'code', href: 'https://github.com/letterengine/typefobia.com' },
    ],
    media: [clip(), desktop('guests'), phone('phone')],
  },
  {
    slug: 'fontfactory',
    started: '2022-11',
    updated: PROJECTS_UPDATED,
    stack: ['javascript', 'html', 'css', 'rust'],
    links: [
      { kind: 'live', href: 'https://fontfactory.vercel.app' },
      { kind: 'code', href: 'https://github.com/eduairet/fontfactory' },
    ],
    media: [desktop('home'), phone('phone')],
  },
  {
    slug: 'interplanetary-fonts',
    started: '2022-09',
    updated: PROJECTS_UPDATED,
    stack: ['react', 'ethereum', 'tailwind', 'vercel', 'graphql', 'thegraph'],
    links: [
      {
        kind: 'showcase',
        href: 'https://ethglobal.com/showcase/interplanetary-fonts-ekwuo',
      },
      {
        kind: 'accelerator',
        href: 'https://www.blog.encode.club/women-build-web3-accelerator-with-encode-summary-67cc905de63c',
      },
      {
        kind: 'code',
        href: 'https://github.com/letterengine/interplanetary-fonts-ethonline',
      },
      {
        kind: 'appCode',
        href: 'https://github.com/interplanetaryfonts/interplanetaryfonts.xyz',
      },
    ],
    media: [
      {
        kind: 'video',
        frame: 'plain',
        name: 'clip-demo',
        width: 1280,
        height: 720,
        demo: true,
      },
      desktop('gallery'),
      clip('clip-font'),
      phone('phone', [780, 390]),
    ],
  },
  {
    slug: 'ascii-name-generator',
    started: '2021-06',
    updated: PROJECTS_UPDATED,
    stack: ['python', 'html', 'css', 'javascript'],
    links: [
      { kind: 'live', href: 'https://eduairet.github.io/asciiArtName/' },
      { kind: 'code', href: 'https://github.com/eduairet/asciiArtName' },
    ],
    media: [
      { ...desktop('terminal'), height: 640 },
      desktop('names'),
      phone('phone'),
    ],
    art: 'ascii',
  },
];

export const HOME_PROJECTS: ProjectSlug[] = [
  'collectible-pleasures',
  'melvin-pay',
  'interplanetary-fonts',
];

// Three rows of three; the rest wait behind "View all".
export const PROJECT_GRID_LIMIT = 9;

export const findProject = (slug: string) =>
  PROJECTS.find((project) => project.slug === slug);

export const nextProject = (slug: ProjectSlug) =>
  PROJECTS[(PROJECTS.findIndex((p) => p.slug === slug) + 1) % PROJECTS.length];

export const projectFile = (slug: string, file: string) =>
  `/projects/${slug}/${file}`;
