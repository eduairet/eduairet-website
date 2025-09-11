import { ImageResponse } from 'next/og';
import variables from '@/styles/abstracts/variables/index.module.scss';
import EatLogoOpenGraph from '@/components/brand/EatLogoOpenGraph';

export const runtime = 'edge';

export const alt = 'Eduardo Aire Torres';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: variables.white,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EatLogoOpenGraph width={1200} height={630} fill='black' />
      </div>
    ),
    {
      ...size,
    }
  );
}
