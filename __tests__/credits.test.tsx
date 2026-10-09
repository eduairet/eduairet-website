import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Credits from '@/components/ui/Credits/Credits';

afterEach(cleanup);

test.each([
  ['en', 'Designed and built by', '(opens in a new tab)'],
  ['es', 'Diseñado y desarrollado por', '(se abre en otra pestaña)'],
] as const)(
  '%s credits link the author, the font and the foundry',
  async (lang, opening, newTab) => {
    render(await Credits({ lang }));

    expect(screen.getByText(new RegExp(`^${opening}`))).toBeTruthy();
    for (const [name, href] of [
      ['Eduardo Aire Torres', 'https://github.com/eduairet'],
      ['Degular', 'https://ohnotype.co/fonts/degular'],
      ['OH no Type Co.', 'https://ohnotype.co'],
    ]) {
      // jsdom drops the space before the hidden text; Chrome keeps it.
      const link = screen.getByRole('link', {
        name: (n) => n.startsWith(name) && n.endsWith(newTab),
      });
      expect(link.getAttribute('href')).toBe(href);
      expect(link.getAttribute('target')).toBe('_blank');
    }
    expect(document.body.textContent).not.toMatch(/[{}]/);
  }
);
