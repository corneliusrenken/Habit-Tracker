import React from 'react';
import { ListView, SelectedOccurrence } from '../../globalTypes';
import './dates.css';

type Props = {
  latchedListView: ListView;
  selectedOccurrences: SelectedOccurrence[];
  todaysIndex: number;
};

export default function Dates({ latchedListView, selectedOccurrences, todaysIndex }: Props) {
  const occurrencesForWeek = latchedListView.name === 'yesterday' && todaysIndex === 6
    ? selectedOccurrences.slice(selectedOccurrences.length - 14, selectedOccurrences.length - 7)
    : selectedOccurrences.slice(selectedOccurrences.length - 7);

  return (
    <div className="dates-container">
      {occurrencesForWeek.map(({ date, complete }, index) => {
        let className = 'date';
        if (complete) className += ' greyed-out';

        return (
          <div
            key={index} // eslint-disable-line react/no-array-index-key
            className={className}
          >
            {date}
          </div>
        );
      })}
      <div className="date-selector" style={{ left: `calc(5px + ${todaysIndex} * 50px)` }} />
    </div>
  );
}
