'use client';

import { useRouter } from 'next/navigation';

// Prefetch when a visitor points at or focuses the link, not when it scrolls
// into view: Chrome warns when a prefetched page's preloaded CSS goes unused.
export default function usePrefetchOnIntent(href: string) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);

  return {
    prefetch: false,
    onMouseEnter: prefetch,
    onFocus: prefetch,
    onTouchStart: prefetch,
  } as const;
}
