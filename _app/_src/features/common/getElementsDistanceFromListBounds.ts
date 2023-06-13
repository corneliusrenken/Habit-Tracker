import getVerticalMarginHeight from './getVerticalMarginHeight';

export default function getElementsDistanceFromListBounds(
  elementBounds: { top: number; bottom: number },
) {
  const verticalMarginHeight = getVerticalMarginHeight();
  const listBounds = {
    top: verticalMarginHeight + 100,
    bottom: window.innerHeight - verticalMarginHeight,
  };
  let distance = 0;
  if (elementBounds.top < listBounds.top) {
    distance = elementBounds.top - listBounds.top;
  } else if (elementBounds.bottom > listBounds.bottom) {
    distance = elementBounds.bottom - listBounds.bottom;
  }
  return distance;
}
