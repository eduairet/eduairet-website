import { RefObject, useEffect } from 'react';
import { useReveal } from '@/components/wrappers/RevealOnScroll/useReveal';
import { showCardShape } from './cardShapes';

export function useCardShape(
  cardRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  shapeClassName: string
) {
  useReveal(cardRef);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    return showCardShape({
      card,
      content: contentRef.current,
      className: shapeClassName,
    });
  }, [cardRef, contentRef, shapeClassName]);
}
