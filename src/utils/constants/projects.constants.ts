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
  | 'appCode'
  | 'talk'
  | 'pitch';

export type ProjectArt = 'letrastica' | 'torus' | 'waves' | 'ascii';

export type MediaFrame = 'browser' | 'phone' | 'plain';

export interface ProjectImage {
  kind: 'image';
  frame: MediaFrame;
  name: string;
  width: number;
  height: number;
  // Exported widths, largest first; files are `${name}-${width}.webp`.
  widths: number[];
  // Phones paint their status bar in the color at the top of the screen.
  statusBar?: string;
}

export interface ProjectVideo {
  kind: 'video';
  frame: MediaFrame;
  name: string;
  width: number;
  height: number;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export interface Project {
  slug: ProjectSlug;
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

const phone = (
  name: string,
  statusBar: string,
  widths = [390]
): ProjectImage => ({
  kind: 'image',
  frame: 'phone',
  name,
  width: 390,
  height: 844,
  widths,
  statusBar,
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

const PROJECTS_UPDATED = '2026-10-19';

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
      'glyphs',
    ],
    links: [
      { kind: 'live', href: 'https://www.eduardopavon.co' },
      { kind: 'code', href: 'https://github.com/Edvardito/eduardopavon.co' },
    ],
    media: [
      desktop('home'),
      clip(),
      clip('clip-loupe'),
      phone('phone', '#f0ffea'),
    ],
  },
  {
    slug: 'font-proofer',
    started: '2026-06',
    updated: PROJECTS_UPDATED,
    stack: ['python', 'docker', 'claudecode', 'html', 'css'],
    links: [
      { kind: 'code', href: 'https://github.com/eduairet/claude-font-proofer' },
      { kind: 'talk', href: 'https://2026.typographics.com/typelab/#2514' },
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
    links: [{ kind: 'live', href: 'https://2024.letrastica.com/' }],
    media: [desktop('desktop'), phone('phone', '#000000')],
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
    media: [clip(), desktop('groups'), phone('phone', '#222222')],
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
    media: [desktop('home'), phone('phone', '#ffffff')],
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
    media: [desktop('home'), phone('phone', '#000000')],
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
      phone('phone', '#fafafa', [780, 390]),
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
    media: [clip(), desktop('guests'), phone('phone', '#ff047b')],
  },
  {
    slug: 'fontfactory',
    started: '2022-11',
    updated: PROJECTS_UPDATED,
    stack: ['javascript', 'html', 'css', 'rust', 'near'],
    links: [
      { kind: 'live', href: 'https://fontfactory.vercel.app' },
      { kind: 'code', href: 'https://github.com/eduairet/fontfactory' },
    ],
    media: [desktop('home'), phone('phone', '#000000')],
  },
  {
    slug: 'interplanetary-fonts',
    started: '2022-09',
    updated: PROJECTS_UPDATED,
    stack: ['react', 'ethereum', 'tailwind', 'vercel', 'graphql', 'thegraph'],
    links: [
      {
        kind: 'live',
        href: 'https://interplanetary-fonts-ethonline.vercel.app',
      },
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
      {
        kind: 'pitch',
        href: 'https://www.youtube.com/watch?v=rNPPYQ38o9s',
      },
    ],
    media: [
      desktop('gallery'),
      clip('clip-font'),
      phone('phone', '#ffffdd', [780, 390]),
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
      phone('phone', '#050505'),
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
