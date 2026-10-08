import { ImageResponse } from 'next/og';
import { Colors, OG_IMAGE_SIZE } from '@/utils/constants';
import { locales } from '@/utils/server/localization.utils';
import EatLogoOpenGraph from '@/components/brand/EatLogoOpenGraph';

// The localized alt text is set with the image in buildPageMetadata.
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
      <EatLogoOpenGraph width={1200} height={630} fill='black' />
    </div>,
    {
      ...size,
    }
  );
}
