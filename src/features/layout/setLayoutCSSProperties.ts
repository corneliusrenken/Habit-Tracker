import { ViewType } from '../../globalTypes';
import { LayoutOptions } from './types';

export default function setLayoutCSSProperties(
  layoutOptions: LayoutOptions,
  viewType: ViewType,
  listRows: number,
  occurrenceRows: number,
) {
  const windowHeight = window.innerHeight;
  const { minMarginHeight, maxListHeight } = layoutOptions;

  if (viewType === 'list') {
    // + 100 for days and dates
    const listHeight = listRows * 50 + 100;
    const listAvailableSpace = Math.min(windowHeight - 2 * minMarginHeight, maxListHeight);
    const overflow = listHeight - listAvailableSpace;

    const marginHeight = (windowHeight - listAvailableSpace) / 2;
    const screenHeight = overflow > 0
      ? windowHeight + overflow
      : windowHeight;
    const screenOffset = occurrenceRows * 50 - 50 > marginHeight
      ? occurrenceRows * 50 - 50 - marginHeight
      : 0;

    document.documentElement.style.setProperty('--screen-offset', `${screenOffset}px`);
    document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
    document.documentElement.style.setProperty('--latched-list-view-margin-height', `${marginHeight}px`);
    document.documentElement.style.setProperty('--margin-height', `${marginHeight}px`);
  }

  if (viewType === 'occurrence') {
    // + 50 for dates row
    const occurrenceHeight = occurrenceRows * 50 + 50;
    const screenMidpoint = Math.ceil(windowHeight / 2);
    // allows bottom most occurrence row to be centered on screen
    const marginBelowOccurrences = windowHeight - screenMidpoint - 25;
    const overflow = occurrenceHeight + marginBelowOccurrences - windowHeight;
    const marginAboveOccurrences = overflow > 0
      ? 0
      : windowHeight - marginBelowOccurrences - occurrenceHeight;
    const screenHeight = overflow > 0
      ? windowHeight + overflow
      : windowHeight;

    document.documentElement.style.setProperty('--screen-offset', '0px');
    document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
    document.documentElement.style.setProperty('--margin-height', `${marginAboveOccurrences}px`);
  }
}
