import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import StoreProvider from '@/store/StoreProvider';
import NavMainMenu from '@/components/ui/Nav/NavMainMenu';
import NavLangMenu from '@/components/ui/Nav/NavLangMenu';
import { Dictionary, EnContent, EsContent, type Lang } from '@/models';

const nav = vi.hoisted(() => ({
  locale: 'en',
  pathname: '/en',
  prefetch: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ prefetch: nav.prefetch }),
}));

// The phone layout's media query matches while `media.phone` is true.
const media = {
  phone: false,
  onChange: undefined as (() => void) | undefined,
};

window.matchMedia = ((query: string) => ({
  get matches() {
    return media.phone && query.includes('max-width');
  },
  addEventListener: (_: string, listener: () => void) => {
    media.onChange = listener;
  },
  removeEventListener: () => {},
})) as unknown as typeof window.matchMedia;

const renderMenus = () =>
  render(
    <StoreProvider
      locale={nav.locale as Lang}
      content={new Dictionary(nav.locale === 'es' ? EsContent : EnContent)}
    >
      <nav>
        <NavMainMenu themeLabel='Theme' />
        <NavLangMenu />
      </nav>
      <a href='#outside'>Outside</a>
    </StoreProvider>
  );

afterEach(() => {
  cleanup();
  nav.prefetch.mockClear();
  nav.locale = 'en';
  nav.pathname = '/en';
  media.phone = false;
  localStorage.clear();
});

const langMenu = () => within(document.getElementById('nav-lang-menu')!);

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

    fireEvent.click(langMenu().getByRole('link', { name: 'Español' }));

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  test('a tap or click on a link moves focus back without the focus ring', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Language' });
    fireEvent.click(button);
    const focus = vi.spyOn(button, 'focus');

    fireEvent.click(langMenu().getByRole('link', { name: 'Español' }), {
      detail: 1,
    });

    expect(focus).toHaveBeenCalledWith({ focusVisible: false });
  });

  test('Enter on a link or Escape moves focus back with the focus ring', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Menu' });
    const focus = vi.spyOn(button, 'focus');

    fireEvent.click(button);
    fireEvent.click(screen.getByRole('link', { name: 'Contact' }), {
      detail: 0,
    });
    expect(focus).toHaveBeenLastCalledWith({ focusVisible: true });

    fireEvent.click(button);
    const link = screen.getByRole('link', { name: 'Contact' });
    link.focus();
    fireEvent.keyDown(link, { key: 'Escape' });
    expect(focus).toHaveBeenLastCalledWith({ focusVisible: true });
  });

  test('language links name their language in that language', () => {
    renderMenus();
    const english = langMenu().getByRole('link', { name: 'English' });
    const spanish = langMenu().getByRole('link', { name: 'Español' });

    expect(english.getAttribute('lang')).toBe('en');
    expect(spanish.getAttribute('lang')).toBe('es');
    expect(english.getAttribute('aria-current')).toBe('page');
  });

  test('nav links prefetch their page when pointed at or focused', () => {
    renderMenus();
    const contact = screen.getByRole('link', { name: 'Contact' });
    const spanish = langMenu().getByRole('link', { name: 'Español' });
    fireEvent.mouseEnter(contact);
    fireEvent.focus(spanish);

    expect(nav.prefetch.mock.calls).toEqual([
      [contact.getAttribute('href')],
      [spanish.getAttribute('href')],
    ]);
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

  test('only one menu is open at a time', () => {
    renderMenus();
    const menu = screen.getByRole('button', { name: 'Menu' });
    const language = screen.getByRole('button', { name: 'Language' });

    fireEvent.click(menu);
    fireEvent.click(language);

    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(language.getAttribute('aria-expanded')).toBe('true');
  });

  test('an open dropdown closes when the window shrinks to phone width', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);
    media.phone = true;
    act(() => media.onChange?.());

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('the language dropdown also closes at phone width', () => {
    renderMenus();
    const button = screen.getByRole('button', { name: 'Language' });
    fireEvent.click(button);
    media.phone = true;
    act(() => media.onChange?.());

    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  test('wider screens keep the dropdown, not a dialog', () => {
    renderMenus();
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Outside').hasAttribute('inert')).toBe(false);
  });
});

describe('Phone menu (modal dialog pattern)', () => {
  const openPhoneMenu = () => {
    media.phone = true;
    localStorage.setItem('theme', 'dark');
    renderMenus();
    const button = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(button);
    return { button, dialog: screen.getByRole('dialog', { name: 'Menu' }) };
  };

  test('holds Home, Contact, both languages and the theme toggle', () => {
    const { button, dialog } = openPhoneMenu();
    const menu = within(dialog);

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.contains(button)).toBe(true);
    for (const name of ['Home', 'Contact', 'English', 'Español'])
      expect(menu.getByRole('link', { name })).toBeTruthy();
    expect(
      menu.getByRole('button', { name: 'Switch to light theme' })
    ).toBeTruthy();
    expect(menu.getByText('Theme')).toBeTruthy();
  });

  test('moves focus in and makes the page behind inert', () => {
    openPhoneMenu();

    expect(document.activeElement?.textContent).toBe('Home');
    expect(screen.getByText('Outside').hasAttribute('inert')).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  test('Escape closes it, returns focus and frees the page', () => {
    const { button } = openPhoneMenu();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('Outside').hasAttribute('inert')).toBe(false);
    expect(document.documentElement.style.overflow).toBe('');
  });

  test('Tab and Shift+Tab wrap around inside it', () => {
    const { button, dialog } = openPhoneMenu();
    const theme = within(dialog).getByRole('button', {
      name: 'Switch to light theme',
    });

    theme.focus();
    fireEvent.keyDown(theme, { key: 'Tab' });
    expect(document.activeElement).toBe(button);

    fireEvent.keyDown(button, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(theme);
  });

  test('choosing a link closes it and returns focus to the button', () => {
    const { button, dialog } = openPhoneMenu();
    fireEvent.click(within(dialog).getByRole('link', { name: 'Contact' }));

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  test('its theme toggle switches the theme and its name, and stays open', () => {
    const { button, dialog } = openPhoneMenu();
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Switch to light theme' })
    );

    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(
      within(dialog).getByRole('button', { name: 'Switch to dark theme' })
    ).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  test('language links keep the current page', () => {
    nav.pathname = '/en/contact';
    const { dialog } = openPhoneMenu();
    const menu = within(dialog);

    expect(
      menu.getByRole('link', { name: 'Español' }).getAttribute('href')
    ).toBe('/es/contact');
    expect(
      menu.getByRole('link', { name: 'English' }).getAttribute('aria-current')
    ).toBe('page');
  });

  test('closes when the window grows past phone width', () => {
    const { button } = openPhoneMenu();
    media.phone = false;
    act(() => media.onChange?.());

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });
});
