import React from 'react';
import { View } from '../../globalTypes';
import './layout.css';

type Props = {
  options: {
    marginHeight: string;
    maxBodyHeight: string;
  }
  view: View;
  habitRows: number;
  occurrenceRows: number;
};

export default function Layout({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options, view, habitRows, occurrenceRows,
}: Props) {
  const viewType = view.name === 'focus' || view.name === 'history'
    ? 'occurrence'
    : 'list';

  // to prevent jiggly behavior, would be best to move the whole layout container at once
  // does that work with habit view scrolling?
  // you wanted position sticky for the top stuff

  // could occ, dates and days be sticky?

  return (
    <div className="layout-container">
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
          height: `${habitRows * 50}px`,
          opacity: viewType === 'list' ? 1 : 0.2,
        }}
      >
        Habits
      </div>
    </div>
  );
}
