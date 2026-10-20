import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { Dictionary, EnContent, EsContent, type Lang } from '@/models';
import { stubResizeObserver } from './helpers/resizeObserver';
import ProjectsSection from '@/app/[locale]/components/ProjectsSection/ProjectsSection';
import ProjectGrid, {
  MORE_PROJECTS_ID,
} from '@/app/[locale]/projects/components/ProjectGrid/ProjectGrid';
import ProjectPage, {
  dynamicParams,
  generateStaticParams,
} from '@/app/[locale]/projects/[slug]/page';
import { generateLocaleParams as localeParams } from '@/utils/server';
import { toProjectCard } from '@/components/ui/ProjectCard/projectCards';
import { PROJECT_GRID_LIMIT, PROJECTS } from '@/utils/constants';
import { buildPageMetadata, buildProjectMetadata } from '@/utils/server';

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/en/projects',
  useRouter: () => ({ prefetch: vi.fn() }),
}));

const content: Record<Lang, Dictionary> = {
  en: new Dictionary(EnContent),
  es: new Dictionary(EsContent),
};
const SITE = 'https://www.eduairet.com';

beforeEach(() => {
  stubResizeObserver();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  // jsdom has no SVG geometry or SMIL control.
  Object.assign(SVGElement.prototype, {
    getBBox: () => ({ x: 0, y: 0, width: 100, height: 100 }),
    pauseAnimations() {},
    unpauseAnimations() {},
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const cardsOf = (list: HTMLElement) =>
  [...list.children].filter((child) => child.tagName === 'LI') as HTMLElement[];

describe('Home Projects section', () => {
  test.each(['en', 'es'] as const)(
    '%s shows Collectible Pleasures, Melvin Pay and InterplanetaryFonts in order',
    (locale) => {
      render(
        <ProjectsSection
          id='projects'
          locale={locale}
          content={content[locale]}
        />
      );
      const section = document.getElementById('projects')!;
      const cards = cardsOf(section.querySelector('ul')!);

      expect(
        cards.map((card) => card.querySelector('h3')?.textContent)
      ).toEqual(['Collectible Pleasures', 'Melvin Pay', 'InterplanetaryFonts']);
      expect(
        cards.map((card) =>
          [...card.querySelectorAll('a')].map((a) => a.getAttribute('href'))
        )
      ).toEqual([
        [`/${locale}/projects/collectible-pleasures`],
        [`/${locale}/projects/melvin-pay`],
        [`/${locale}/projects/interplanetary-fonts`],
      ]);
      const seeMore = within(section).getByRole('link', {
        name: content[locale].projects.seeMore,
      });
      expect(seeMore.getAttribute('href')).toBe(`/${locale}/projects`);
    }
  );
});

describe('/projects grid', () => {
  const cards = PROJECTS.map((project) =>
    toProjectCard('en', content.en.projects, project)
  );

  const renderGrid = (list = cards) =>
    render(
      <ProjectGrid cards={list} viewAll='View all' techStack='Tech stack' />
    );

  test('every project is listed, and only the first 9 show before "View all"', () => {
    renderGrid();
    const items = cardsOf(screen.getAllByRole('list')[0]);

    expect(items).toHaveLength(PROJECTS.length);
    expect(
      items.filter((item) => item.className.includes('extra'))
    ).toHaveLength(PROJECTS.length - PROJECT_GRID_LIMIT);
    expect(items[PROJECT_GRID_LIMIT].id).toBe(MORE_PROJECTS_ID);
    // Without JavaScript the link targets the first hidden card.
    expect(
      screen.getByRole('link', { name: 'View all' }).getAttribute('href')
    ).toBe(`#${MORE_PROJECTS_ID}`);
  });

  test('"View all" opens the rest and moves focus to the first new card', () => {
    renderGrid();
    const list = screen.getAllByRole('list')[0];
    fireEvent.click(screen.getByRole('link', { name: 'View all' }));

    expect(list.hasAttribute('data-open')).toBe(true);
    expect(document.activeElement?.getAttribute('href')).toBe(
      cards[PROJECT_GRID_LIMIT].href
    );
  });

  test('with 9 projects or fewer there is no "View all"', () => {
    renderGrid(cards.slice(0, PROJECT_GRID_LIMIT));
    expect(screen.queryByRole('link', { name: 'View all' })).toBeNull();
  });
});

describe('Project pages', () => {
  const renderPage = async (locale: Lang, slug: string) =>
    render(await ProjectPage({ params: Promise.resolve({ locale, slug }) }));

  test.each(
    PROJECTS.flatMap((project) =>
      (['en', 'es'] as const).map((locale) => [locale, project] as const)
    )
  )(
    '%s %s shows its external links next to the explanation',
    async (locale, project) => {
      await renderPage(locale, project.slug);
      const copy = content[locale].projects;

      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
        copy.items[project.slug].title
      );
      const links = project.links.length
        ? within(
            screen.getByRole('list', { name: copy.linksLabel })
          ).getAllByRole('link')
        : [];
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        project.links.map(({ href }) => href)
      );
      for (const link of links)
        expect(link.getAttribute('target')).toBe('_blank');
    }
  );

  const teamProjects = PROJECTS.filter(
    ({ slug }) => content.en.projects.items[slug].team
  );

  test('the team projects name their teammates', () => {
    expect(teamProjects.map(({ slug }) => slug)).toEqual([
      'the-session',
      'typefobia',
      'interplanetary-fonts',
    ]);
  });

  test.each(
    teamProjects.flatMap((project) =>
      (['en', 'es'] as const).map((locale) => [locale, project] as const)
    )
  )(
    '%s %s links each teammate to their GitHub profile',
    async (locale, project) => {
      await renderPage(locale, project.slug);
      const team = content[locale].projects.items[project.slug].team!;
      const handles = [...team.matchAll(/\{(\w+)\}/g)].map(
        ([, handle]) => handle
      );
      expect(handles.length).toBeGreaterThan(0);
      for (const handle of handles) {
        const link = screen.getByRole('link', {
          name: new RegExp(`^@${handle}(?!\\w)`),
        });
        expect(link.getAttribute('href')).toBe(`https://github.com/${handle}`);
      }
    }
  );

  test('a project without links shows no link list', async () => {
    await renderPage('en', 'melvin-pay');
    expect(
      screen.queryByRole('list', { name: content.en.projects.linksLabel })
    ).toBeNull();
  });

  test('the page links back to all projects and on to the next one', async () => {
    await renderPage('en', 'eduardo-pavon');
    expect(
      screen
        .getByRole('link', { name: content.en.projects.allProjects })
        .getAttribute('href')
    ).toBe('/en/projects');
    const next = screen.getByRole('navigation', {
      name: content.en.projects.nextProject,
    });
    expect(within(next).getByRole('link').getAttribute('href')).toBe(
      '/en/projects/font-proofer'
    );
  });

  test('every slug has static params in both locales', async () => {
    const locales = (await localeParams()).map(({ locale }) => locale);
    const slugs = generateStaticParams().map(({ slug }) => slug);
    const pairs = locales.flatMap((locale) =>
      slugs.map((slug) => `${locale}/${slug}`)
    );

    expect(locales.sort()).toEqual(['en', 'es']);
    expect(slugs).toEqual(PROJECTS.map(({ slug }) => slug));
    expect(new Set(pairs).size).toBe(2 * PROJECTS.length);
    expect(dynamicParams).toBe(false);
  });

  test('an unknown slug 404s', async () => {
    await expect(
      ProjectPage({ params: Promise.resolve({ locale: 'en', slug: 'nope' }) })
    ).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
    await expect(buildProjectMetadata('en', 'nope')).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404'
    );
  });
});

describe('Project metadata', () => {
  test('/projects has its own title, canonical and hreflang', async () => {
    const metadata = await buildPageMetadata('es', 'projects');
    expect(metadata.title).toBe('Proyectos | Eduardo Aire Torres');
    expect(metadata.alternates).toMatchObject({
      canonical: `${SITE}/es/projects`,
      languages: {
        en: `${SITE}/en/projects`,
        es: `${SITE}/es/projects`,
        'x-default': `${SITE}/projects`,
      },
    });
  });

  test.each(PROJECTS.map(({ slug }) => slug))(
    '%s points its canonical and hreflang at itself',
    async (slug) => {
      const metadata = await buildProjectMetadata('en', slug);
      expect(metadata.title).toBe(
        `${content.en.projects.items[slug].title} | Eduardo Aire Torres`
      );
      expect(metadata.description).toBe(
        content.en.projects.items[slug].summary
      );
      expect(metadata.alternates).toMatchObject({
        canonical: `${SITE}/en/projects/${slug}`,
        languages: {
          en: `${SITE}/en/projects/${slug}`,
          es: `${SITE}/es/projects/${slug}`,
          'x-default': `${SITE}/projects/${slug}`,
        },
      });
      expect(metadata.openGraph).toMatchObject({
        url: `${SITE}/en/projects/${slug}`,
      });
    }
  );
});

describe('Project copy', () => {
  test.each(PROJECTS.map(({ slug }) => slug))(
    '%s has every text and alt in both languages',
    (slug) => {
      const project = PROJECTS.find((p) => p.slug === slug)!;
      for (const locale of ['en', 'es'] as const) {
        const item = content[locale].projects.items[slug];
        for (const text of [item.title, item.period, item.role, item.summary])
          expect(text, `${locale} ${slug}`).not.toBe('');
        expect(item.explanation.length).toBeGreaterThan(0);
        expect(item.highlights.length).toBeGreaterThan(0);
        expect(Object.keys(item.media).sort(), locale).toEqual(
          project.media.map(({ name }) => name).sort()
        );
        for (const media of project.media)
          expect(
            item.media[media.name],
            `${locale} ${media.name}`
          ).toBeTruthy();
        for (const { kind } of project.links)
          expect(content[locale].projects.links[kind]).toBeTruthy();
      }
    }
  );
});

describe('Project media files', () => {
  test.each(PROJECTS.map((project) => [project.slug, project] as const))(
    '%s has exactly the files its media list names',
    (slug, project) => {
      const expected = project.media.flatMap((item) =>
        item.kind === 'image'
          ? item.widths.map((width) => `${item.name}-${width}.webp`)
          : [`${item.name}.mp4`, `${item.name}-poster.webp`]
      );
      expect(
        readdirSync(join(process.cwd(), 'public/projects', slug)).sort()
      ).toEqual([...expected, 'og.jpg'].sort());
    }
  );

  test('every phone screen names a status bar color', () => {
    const phones = PROJECTS.flatMap(({ media }) => media).filter(
      (item) => item.frame === 'phone'
    );
    expect(phones.length).toBeGreaterThan(0);
    for (const phone of phones)
      expect(phone.kind === 'image' && phone.statusBar).toMatch(
        /^#[0-9a-f]{6}$/
      );
  });
});
