import * as simpleIcons from 'simple-icons';

interface SimpleIcon {
  title: string;
  path: string;
}

export interface TechIconData {
  title: string;
  path: string;
}

// Map our short stack keys to simple-icons export names. Kept as strings so a
// renamed/missing icon degrades to nothing instead of breaking the build.
const ICON_EXPORTS: Record<string, string> = {
  dotnet: 'siDotnet',
  nextjs: 'siNextdotjs',
  typescript: 'siTypescript',
  javascript: 'siJavascript',
  react: 'siReact',
  docker: 'siDocker',
  node: 'siNodedotjs',
  python: 'siPython',
  angular: 'siAngular',
  sass: 'siSass',
  tailwind: 'siTailwindcss',
  ethereum: 'siEthereum',
  html: 'siHtml5',
  css: 'siCss',
  p5: 'siP5dotjs',
  mysql: 'siMysql',
  wordpress: 'siWordpress',
  sentry: 'siSentry',
  claudecode: 'siClaudecode',
  netlify: 'siNetlify',
  vercel: 'siVercel',
  graphql: 'siGraphql',
};

// Listed by name: their owners don't allow logo use without permission.
const TOOL_NAMES: Record<string, string> = {
  glyphs: 'Glyphs',
  robofont: 'RoboFont',
  drawbot: 'DrawBot',
  illustrator: 'Adobe Illustrator',
  photoshop: 'Adobe Photoshop',
  indesign: 'Adobe InDesign',
  aftereffects: 'Adobe After Effects',
  mssql: 'Microsoft SQL Server',
  aws: 'AWS',
  codex: 'OpenAI Codex',
  thegraph: 'The Graph',
};

const icons = simpleIcons as unknown as Record<string, SimpleIcon | undefined>;

// Resolve on the server so `simple-icons` never reaches the client bundle.
export function resolveStack(stack: string[]) {
  return {
    icons: stack
      .map((name) => icons[ICON_EXPORTS[name] ?? ''])
      .filter((icon): icon is SimpleIcon => Boolean(icon))
      .map(({ title, path }): TechIconData => ({ title, path })),
    tools: stack.map((name) => TOOL_NAMES[name]).filter(Boolean),
  };
}
