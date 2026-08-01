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
};

const icons = simpleIcons as unknown as Record<string, SimpleIcon | undefined>;

// Resolve on the server so `simple-icons` never reaches the client bundle.
export function resolveStack(stack: string[]): TechIconData[] {
  return stack
    .map((name) => icons[ICON_EXPORTS[name] ?? ''])
    .filter((icon): icon is SimpleIcon => Boolean(icon))
    .map(({ title, path }) => ({ title, path }));
}
