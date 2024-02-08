import { ImageResponse } from 'next/og';
import variables from '@/styles/abstracts/_variables.module.scss';

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
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={size.width}
          height={size.height}
          viewBox='0 0 1200 630'
          xmlSpace='preserve'
          style={{ fill: variables.black }}
          fill={variables.black}
        >
          <path d='M427.5 260.3v77.1h-62.3v-77.1c0-28.3 7.4-56.1 31.2-56.1 23.7 0 31.1 27.8 31.1 56.1zM1025 315c0 234.7-190.3 425-425 425S175 549.7 175 315s190.3-425 425-425 425 190.3 425 425zm-538-15c0-76.5-45.3-104.3-90.7-104.3-46.5 0-90.7 27.8-90.7 104.3 0 23.8 5.7 70.8 5.7 105.4 0 17-2.8 34.6-5.7 37.4l101.4 51 69.1-63.5-1.1-1.1c-6.8 6.8-16.4 12.5-30 15.9l-79.9-40.2V346l121.8 2.3V300zm255.5 141.6-1.1-1.1c-1.7 1.7-5.1 3.4-9.1 4.5L696 408.8V300c0-76.5-41.4-104.3-87.8-104.3-53.3 0-87.8 44.8-87.8 90.1 0 24.4 11.9 41.4 34 41.4 19.8 0 34-14.2 34-34 0-21-11.3-29.5-11.3-48.7 0-22.1 7.4-40.2 31.2-40.2 18.7 0 31.2 10.8 31.2 56.1v148.5c0 19.3-2.3 30.6-18.1 31.7L577 412.2v-29.5c0-20.4 17.6-32.9 29.5-36.8v-1.1l-94.6 24.4c2.8 2.8 8.5 19.8 8.5 36.8 0 16.4-5.7 33.4-8.5 36.8l76.5 51 51-51 51 51 52.1-52.2zm151.9-11.3-1.1-1.1c-4 4-11.3 10.2-30 11.3l-38-23.8V218.9H882v-9.1h-56.7v-73.7c-11.3 11.3-31.2 17-56.7 17v56.7h-34v9.1h34v69.7c0 84.4-2.8 137.1-19.8 154.1l82.2 51 63.4-63.4z' />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
