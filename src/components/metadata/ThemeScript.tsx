import { THEME_INIT_SCRIPT } from '@/utils/constants';

// Runs first in body, so data-theme is set before paint. Body suppresses hydration warnings for that attribute.
export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
