import { TYPEKIT_LOADER, TYPEKIT_URL } from '@/utils/constants';

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
