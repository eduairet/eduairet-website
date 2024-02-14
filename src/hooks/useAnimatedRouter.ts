'use client';

import { useRouter } from 'next/navigation';

interface IExtendedDocument extends Document {
  startViewTransition?: any;
}

export default function useAnimatedRouter() {
  const router = useRouter();

  const animatedRoute = (url: string) => {
    const extendedDocument = document as IExtendedDocument;
    if (!extendedDocument.startViewTransition) {
      return router.push(url);
    } else {
      const transition = extendedDocument.startViewTransition(() => {
        router.push(url);
      });
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            opacity: [0, 1],
          },
          {
            duration: 500,
            easing: 'ease-in',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    }
  };

  return { animatedRoute };
}
