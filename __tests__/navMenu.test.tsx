import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import StoreProvider from '@/store/StoreProvider';
import NavMainMenu from '@/components/ui/Nav/NavMainMenu';
import NavLangMenu from '@/components/ui/Nav/NavLangMenu';
import { Dictionary, EnContent, EsContent, type Lang } from '@/models';

const nav = vi.hoisted(() => ({ locale: 'en', pathname: '/en' }));

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: nav.locale }),
  usePathname: () => nav.pathname,
}));

const renderMenus = () =>
  render(
    <StoreProvider
      locale={nav.locale as Lang}
      content={new Dictionary(nav.locale === 'es' ? EsContent : EnContent)}
    >
      <nav>
        <NavMainMenu />
        <NavLangMenu />
      </nav>
      <a href='#outside'>Outside</a>
    </StoreProvider>
  );

afterEach(() => {
  cleanup();
  nav.locale = 'en';
  nav.pathname = '/en';
});

describe('Nav menus (disclosure pattern)', () => {
  test('toggle exposes aria-expanded and controls its list', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Menu' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    const list = document.getElementById(
      button.getAttribute('aria-controls') ?? ''
    );
    expect(list?.tagName).toBe('UL');

    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  test('Escape closes the menu and returns focus to the toggle', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);

    const link = screen.getByRole('link', { name: 'Contact' });
    link.focus();
    fireEvent.keyDown(link, { key: 'Escape' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  test('menu closes when focus leaves it', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);

    fireEvent.blur(button, {
      relatedTarget: screen.getByRole('link', { name: 'Outside' }),
    });

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  test('choosing a link closes the menu and focuses the toggle', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Language' });
    fireEvent.click(button);

    fireEvent.click(screen.getByRole('link', { name: 'Español' }));

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  test('language links name their language in that language', () => {
    renderMenus();
    const english = screen.getByRole('link', { name: 'English' });
    const spanish = screen.getByRole('link', { name: 'Español' });

    expect(english.getAttribute('lang')).toBe('en');
    expect(spanish.getAttribute('lang')).toBe('es');
    expect(english.getAttribute('aria-current')).toBe('page');
  });

  test('Spanish pages expose Spanish names', () => {
    nav.locale = 'es';
    nav.pathname = '/es';
    renderMenus();

    expect(screen.getByRole('button', { name: 'Menú' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Idioma' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeTruthy();
  });
});
