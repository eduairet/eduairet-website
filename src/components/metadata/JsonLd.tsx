import { serializeJsonLd } from '@/utils/server/structuredData.utils';

interface IProps {
  data: object;
}

// A native script tag, not next/script: this is data, not code to execute.
export default function JsonLd({ data }: IProps) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
