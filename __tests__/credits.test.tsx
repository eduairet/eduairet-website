import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Credits from '@/components/ui/Credits/Credits';
import { CreditLinks } from '@/utils/constants';

afterEach(cleanup);

test.each([
  ['en', 'Designed and built by', '(opens in a new tab)'],
  ['es', 'Diseñado y desarrollado por', '(se abre en otra pestaña)'],
] as const)(
  '%s credits link every name that has a website',
  async (lang, opening, newTab) => {
    render(await Credits({ lang }));

    expect(screen.getByText(new RegExp(`^${opening}`))).toBeTruthy();
    expect(screen.getAllByRole('link')).toHaveLength(
      Object.keys(CreditLinks).length
    );
    for (const { label, href } of Object.values(CreditLinks)) {
      // jsdom drops the space before the hidden text; Chrome keeps it.
      const link = screen.getByRole('link', {
        name: (n) => n.startsWith(label) && n.endsWith(newTab),
      });
      expect(link.getAttribute('href')).toBe(href);
      expect(link.getAttribute('target')).toBe('_blank');
    }
    expect(document.body.textContent).not.toMatch(/[{}]/);
  }
);
