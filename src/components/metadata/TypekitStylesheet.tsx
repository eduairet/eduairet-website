import { TYPEKIT_LOADER, TYPEKIT_URL } from '@/utils/constants';

// The Adobe Fonts kit, loaded once the page has painted.
export default function TypekitStylesheet() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: TYPEKIT_LOADER }} />
      <noscript>
        <link rel='stylesheet' href={TYPEKIT_URL} />
      </noscript>
    </>
  );
}
