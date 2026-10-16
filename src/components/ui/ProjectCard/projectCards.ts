import type { Lang, ProjectsCopy } from '@/models';
import { resolveStack } from '@/app/[locale]/components/HomeSection/techStack';
import { PageUrls, type Project } from '@/utils/constants';

export interface ProjectCardData {
  slug: string;
  href: string;
  title: string;
  company: string;
  period: string;
  summary: string;
  icons: string[];
  tools: string[];
}

export function toProjectCard(
  locale: Lang,
  copy: ProjectsCopy,
  project: Project
): ProjectCardData {
  const item = copy.items[project.slug];
  return {
    slug: project.slug,
    href: PageUrls.project_(locale, project.slug),
    title: item.title,
    company: item.company ?? '',
    period: item.period,
    summary: item.summary,
    ...resolveStack(project.stack),
  };
}
