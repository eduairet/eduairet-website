import * as simpleIcons from 'simple-icons';

interface SimpleIcon {
  title: string;
  path: string;
}

export interface TechIconData {
  title: string;
  path: string;
}

// Stack keys to display names and simple-icons exports. A tool without an
// icon shows by name: its owner doesn't allow logo use without permission.
// Exports are strings, so a renamed icon falls back to its name too.
const TOOLS: Record<string, { name: string; icon?: string }> = {
  dotnet: { name: '.NET', icon: 'siDotnet' },
  nextjs: { name: 'Next.js', icon: 'siNextdotjs' },
  typescript: { name: 'TypeScript', icon: 'siTypescript' },
  javascript: { name: 'JavaScript', icon: 'siJavascript' },
  react: { name: 'React', icon: 'siReact' },
  docker: { name: 'Docker', icon: 'siDocker' },
  node: { name: 'Node.js', icon: 'siNodedotjs' },
  python: { name: 'Python', icon: 'siPython' },
  angular: { name: 'Angular', icon: 'siAngular' },
  sass: { name: 'Sass', icon: 'siSass' },
  tailwind: { name: 'Tailwind CSS', icon: 'siTailwindcss' },
  ethereum: { name: 'Ethereum', icon: 'siEthereum' },
  html: { name: 'HTML5', icon: 'siHtml5' },
  css: { name: 'CSS', icon: 'siCss' },
  p5: { name: 'p5.js', icon: 'siP5dotjs' },
  mysql: { name: 'MySQL', icon: 'siMysql' },
  wordpress: { name: 'WordPress', icon: 'siWordpress' },
  sentry: { name: 'Sentry', icon: 'siSentry' },
  claudecode: { name: 'Claude Code', icon: 'siClaudecode' },
  netlify: { name: 'Netlify', icon: 'siNetlify' },
  vercel: { name: 'Vercel', icon: 'siVercel' },
  graphql: { name: 'GraphQL', icon: 'siGraphql' },
  glyphs: { name: 'Glyphs' },
  robofont: { name: 'RoboFont' },
  drawbot: { name: 'DrawBot' },
  illustrator: { name: 'Adobe Illustrator' },
  photoshop: { name: 'Adobe Photoshop' },
  indesign: { name: 'Adobe InDesign' },
  aftereffects: { name: 'Adobe After Effects' },
  mssql: { name: 'Microsoft SQL Server' },
  aws: { name: 'AWS' },
  codex: { name: 'OpenAI Codex' },
  thegraph: { name: 'The Graph' },
};

const simpleIconSet = simpleIcons as unknown as Record<
  string,
  SimpleIcon | undefined
>;

// Resolve on the server so `simple-icons` never reaches the client bundle.
export function resolveStack(stack: string[]) {
  const icons: TechIconData[] = [];
  const tools: string[] = [];
  for (const key of stack) {
    const tool = TOOLS[key];
    if (!tool) continue;
    const icon = simpleIconSet[tool.icon ?? ''];
    if (icon) icons.push({ title: icon.title, path: icon.path });
    else tools.push(tool.name);
  }
  return { icons, tools };
}
