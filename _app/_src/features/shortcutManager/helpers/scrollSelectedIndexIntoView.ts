import getElementsDistanceFromListBounds from '../../common/getElementsDistanceFromListBounds';
import getVerticalMarginHeight from '../../common/getVerticalMarginHeight';
import customSmoothScroll from './customSmoothScroll';

function interpolateTValueClamped(
  t: number,
  tMin: number,
  tMax: number,
  newMin: number,
  newMax: number,
): number {
  const tNormalized = (t - tMin) / (tMax - tMin);
  const clampedTNormalized = Math.min(Math.max(tNormalized, 0), 1);
  return (clampedTNormalized * (newMax - newMin)) + newMin;
}

export default function scrollSelectedIndexIntoView(
  selectedIndex: number,
  options: { behavior: 'smooth' | 'instant' },
) {
  const verticalMarginHeight = getVerticalMarginHeight();
  const selectedListItemPosition = verticalMarginHeight + 100 + selectedIndex * 50 - window.scrollY;
  const selectedItemBounds = {
    top: selectedListItemPosition,
    bottom: selectedListItemPosition + 50,
  };

  const scrollAmount = getElementsDistanceFromListBounds(selectedItemBounds);

  if (options.behavior === 'instant') {
    window.scrollBy(0, scrollAmount);
    return;
  }

  const speed = interpolateTValueClamped(Math.abs(scrollAmount), 100, 300, 75, 200);

  if (scrollAmount !== 0) {
    customSmoothScroll(
      scrollAmount + window.scrollY,
      speed,
      10,
      {
        x1: 0.25,
        y1: 0.1,
        x2: 0.25,
        y2: 1,
      },
    );
  }
}
