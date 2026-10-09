import { TYPEKIT_LOADER, TYPEKIT_URL } from '@/utils/constants';

// The Adobe Fonts kit, loaded without blocking the first paint.
export default function TypekitStylesheet() {
  return (
    <>
      <link rel='preload' as='style' href={TYPEKIT_URL} />
      <script dangerouslySetInnerHTML={{ __html: TYPEKIT_LOADER }} />
      <noscript>
        <link rel='stylesheet' href={TYPEKIT_URL} />
      </noscript>
    </>
  );
}
