import React, { useEffect, useState } from 'react';
import { View } from '../../globalTypes';
import './layout.css';

type LayoutOptions = {
  marginHeight: number;
  maxListHeight: number;
};

type Props = {
  options: LayoutOptions;
  view: View;
  listRows: number;
  occurrenceRows: number;
};

type ViewType = 'occurrence' | 'list';

function calculateScreenHeight(
  options: LayoutOptions,
  viewType: ViewType,
  listRows: number,
  occurrenceRows: number,
): number {
  const screenHeight = window.innerHeight;

  if (viewType === 'list') {
    // + 100 for days and dates
    const listHeight = Math.min(listRows * 50 + 100, options.maxListHeight);
    const listHeightWithBothMargins = listHeight + 2 * options.marginHeight;
    const overflow = listHeightWithBothMargins - screenHeight;
    return overflow > 0
      ? screenHeight + overflow
      : screenHeight;
  }

  // + 50 for dates row
  const occurrenceHeight = occurrenceRows * 50 + 50;
  const screenMidpoint = Math.ceil(screenHeight / 2);
  // allows bottom most occurrence row to be centered on screen
  const marginBelowOccurrences = screenHeight - screenMidpoint - 25;
  const overflow = occurrenceHeight + marginBelowOccurrences - screenHeight;
  return overflow > 0
    ? screenHeight + overflow
    : screenHeight;
}

export default function Layout({
  options, view, listRows, occurrenceRows,
}: Props) {
  const viewType: ViewType = view.name === 'focus' || view.name === 'history'
    ? 'occurrence'
    : 'list';

  const [screenHeight, setScreenHeight] = useState(() => calculateScreenHeight(
    options,
    viewType,
    listRows,
    occurrenceRows,
  ));

  // to prevent jiggly behavior, would be best to move the whole layout container at once
  // does that work with habit view scrolling?
  // you wanted position sticky for the top stuff

  // could occ, dates and days be sticky?

  useEffect(() => {
    const onResize = () => setScreenHeight(calculateScreenHeight(
      options,
      viewType,
      listRows,
      occurrenceRows,
    ));

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [listRows, occurrenceRows, options, viewType]);

  return (
    <div
      className="layout-container"
      style={{
        height: `${screenHeight}px`,
      }}
    >
      <div
        className="occurrences"
        style={{
          height: `${occurrenceRows * 50}px`,
          opacity: viewType === 'occurrence' ? 1 : 0.2,
        }}
      >
        Occurrences
      </div>
      <div
        className="days"
        style={{
          opacity: viewType === 'list' ? 1 : 0.2,
        }}
      >
        Days
      </div>
      <div
        className="dates"
      >
        Dates
      </div>
      <div
        className="habits"
        style={{
          height: `${listRows * 50}px`,
          opacity: viewType === 'list' ? 1 : 0.2,
        }}
      >
        Habits
      </div>
    </div>
  );
}
