'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

type IProps = Omit<ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: string;
};

// Prefetch on hover, focus or touch. Chrome warns when preloaded CSS from a prefetch goes unused.
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
