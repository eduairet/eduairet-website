import type { ComponentType } from 'react';
import * as icons from './icons';

// Stack keys to display names and icons. A tool without an icon shows by
// name: its owner doesn't allow logo use without permission.
export const TOOLS: Record<string, { name: string; Icon?: ComponentType }> = {
  dotnet: { name: '.NET', Icon: icons.DotNetIcon },
  nextjs: { name: 'Next.js', Icon: icons.NextjsIcon },
  typescript: { name: 'TypeScript', Icon: icons.TypeScriptIcon },
  javascript: { name: 'JavaScript', Icon: icons.JavaScriptIcon },
  react: { name: 'React', Icon: icons.ReactIcon },
  docker: { name: 'Docker', Icon: icons.DockerIcon },
  node: { name: 'Node.js', Icon: icons.NodejsIcon },
  python: { name: 'Python', Icon: icons.PythonIcon },
  angular: { name: 'Angular', Icon: icons.AngularIcon },
  sass: { name: 'Sass', Icon: icons.SassIcon },
  tailwind: { name: 'Tailwind CSS', Icon: icons.TailwindCssIcon },
  ethereum: { name: 'Ethereum', Icon: icons.EthereumIcon },
  html: { name: 'HTML5', Icon: icons.Html5Icon },
  css: { name: 'CSS', Icon: icons.CssIcon },
  p5: { name: 'p5.js', Icon: icons.P5jsIcon },
  mysql: { name: 'MySQL', Icon: icons.MySqlIcon },
  wordpress: { name: 'WordPress', Icon: icons.WordPressIcon },
  sentry: { name: 'Sentry', Icon: icons.SentryIcon },
  claudecode: { name: 'Claude Code', Icon: icons.ClaudeCodeIcon },
  netlify: { name: 'Netlify', Icon: icons.NetlifyIcon },
  vercel: { name: 'Vercel', Icon: icons.VercelIcon },
  graphql: { name: 'GraphQL', Icon: icons.GraphQlIcon },
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

// Icons go to the cards as keys, so their paths ship in the JS, not the page.
export function resolveStack(stack: string[]) {
  const icons: string[] = [];
  const tools: string[] = [];
  for (const key of stack) {
    const tool = TOOLS[key];
    if (!tool) continue;
    if (tool.Icon) icons.push(key);
    else tools.push(tool.name);
  }
  return { icons, tools };
}
