import { THEME_INIT_SCRIPT } from '@/utils/constants';

// First in <body>, so data-theme is set before anything paints. The body
// needs suppressHydrationWarning, since React did not render that attribute.
export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
