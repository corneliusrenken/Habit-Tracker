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

  return (
    <div className="layout-container">
      <div
        style={{
          backgroundColor: 'lime',
          width: '350px',
          height: `${occurrenceRows * 50}px`,
          opacity: viewType === 'occurrence' ? 1 : 0.2,
        }}
      >
        Occurrences
      </div>
      <div
        style={{
          backgroundColor: 'yellow',
          width: '350px',
          height: '50px',
          opacity: viewType === 'list' ? 1 : 0.2,
        }}
      >
        Days
      </div>
      <div
        style={{
          backgroundColor: 'aqua',
          width: '350px',
          height: '50px',
        }}
      >
        Dates
      </div>
      <div
        style={{
          backgroundColor: 'red',
          width: '350px',
          height: `${habitRows * 50}px`,
          opacity: viewType === 'list' ? 1 : 0.2,
        }}
      >
        Habits
      </div>
    </div>
  );
}
