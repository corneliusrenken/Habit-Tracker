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

function calculateScreenHeightAndSetMargins(
  options: LayoutOptions,
  viewType: ViewType,
  listRows: number,
  occurrenceRows: number,
  setMarginHeight: React.Dispatch<React.SetStateAction<number>>,
): number {
  const screenHeight = window.innerHeight;
  const { marginHeight, maxListHeight } = options;

  if (viewType === 'list') {
    // + 100 for days and dates
    const listHeight = listRows * 50 + 100;
    const listAvailableSpace = Math.min(screenHeight - 2 * marginHeight, maxListHeight);
    const overflow = listHeight - listAvailableSpace;
    setMarginHeight((screenHeight - listAvailableSpace) / 2);
    if (overflow > 0) {
      return screenHeight + overflow;
    }
    return screenHeight;
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

  const [marginHeight, setMarginHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(() => calculateScreenHeightAndSetMargins(
    options,
    viewType,
    listRows,
    occurrenceRows,
    setMarginHeight,
  ));

  // to prevent jiggly behavior, would be best to move the whole layout container at once
  // does that work with habit view scrolling?
  // you wanted position sticky for the top stuff

  // could occ, dates and days be sticky?

  useEffect(() => {
    setScreenHeight(calculateScreenHeightAndSetMargins(
      options,
      viewType,
      listRows,
      occurrenceRows,
      setMarginHeight,
    ));
  }, [listRows, occurrenceRows, options, viewType]);

  useEffect(() => {
    const onResize = () => setScreenHeight(calculateScreenHeightAndSetMargins(
      options,
      viewType,
      listRows,
      occurrenceRows,
      setMarginHeight,
    ));

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [listRows, occurrenceRows, options, viewType]);

  return (
    <>
      <div className="desired-margin-indicator" style={{ height: options.marginHeight, top: 0 }} />
      <div className="desired-margin-indicator" style={{ height: options.marginHeight, bottom: 0 }} />
      <div className="actual-margin" style={{ height: `${marginHeight}px`, top: 0 }} />
      <div className="actual-margin" style={{ height: `${marginHeight}px`, bottom: 0 }} />
      <div
        className="max-list-height-indicator"
        style={{
          height: options.maxListHeight,
          top: (window.innerHeight - options.maxListHeight) / 2,
        }}
      />
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
            opacity: viewType === 'occurrence' ? 1 : 0,
          }}
        />
        <div
          className="days"
          style={{
            opacity: viewType === 'list' ? 1 : 0,
          }}
        />
        <div
          className="dates"
        />
        <div
          className="list"
          style={{
            height: `${listRows * 50}px`,
            opacity: viewType === 'list' ? 1 : 0,
          }}
        />
      </div>
    </>
  );
}
