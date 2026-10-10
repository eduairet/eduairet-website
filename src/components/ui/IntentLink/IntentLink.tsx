'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

type IProps = Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: string;
};

// Prefetches on hover, focus or touch, not when the link renders: Chrome
// warns when a prefetched page's preloaded CSS goes unused.
export default function IntentLink({ href, ...props }: IProps) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);

  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
    />
  );
}
