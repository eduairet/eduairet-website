import { ImageResponse } from 'next/og';
import { Colors, OG_IMAGE_SIZE } from '@/utils/constants';
import EatLogoOpenGraph from '@/components/brand/EatLogoOpenGraph';

export { generateLocaleParams as generateStaticParams } from '@/utils/server/localization.utils';

// alt is localized in buildPageMetadata.
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: Colors.white,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <EatLogoOpenGraph {...size} fill='black' />
    </div>,
    {
      ...size,
    }
  );
}
