import { ImageResponse } from 'next/og';
import { Colors } from '@/utils/constants';
import EatLogoOpenGraph from '@/components/brand/EatLogoOpenGraph';

export const alt = 'Eduardo Aire Torres';
export const size = {
  width: 1200,
  height: 630,
};

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
      <EatLogoOpenGraph width={1200} height={630} fill='black' />
    </div>,
    {
      ...size,
    }
  );
}
