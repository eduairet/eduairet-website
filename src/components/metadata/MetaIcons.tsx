export default function MetaIcons() {
  return ['192x192', '196x196', '256x256', '384x384', '512x512'].map((size) => (
    <link
      key={size}
      rel='icon'
      href={`/icon-${size}.png`}
      type='image/png'
      sizes={size}
    ></link>
  ));
}
