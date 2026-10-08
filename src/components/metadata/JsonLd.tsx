import { serializeJsonLd } from '@/utils/server/structuredData.utils';

interface IProps {
  data: object;
}

// Native script, not next/script: JSON-LD is data, not code.
export default function JsonLd({ data }: IProps) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
