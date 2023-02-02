import React from 'react';
import { ListView, SelectedOccurrence } from '../../globalTypes';

type Props = {
  latchedListView: ListView;
  selectedOccurrences: SelectedOccurrence[];
  todaysIndex: number;
};

export default function Dates({ latchedListView, selectedOccurrences, todaysIndex }: Props) {
  const occurrencesForWeek = latchedListView.name === 'yesterday' && todaysIndex === 6
    ? selectedOccurrences.slice(selectedOccurrences.length - 14, selectedOccurrences.length - 7)
    : selectedOccurrences.slice(selectedOccurrences.length - 7);

  let selectorClassName = 'dates-selector';

  if (occurrencesForWeek[todaysIndex].complete) {
    selectorClassName += ' complete';
  }

  return (
    <div className="dates">
      {occurrencesForWeek.map(({ date, fullDate, complete }) => {
        let className = 'dates-date';
        if (complete) className += ' complete';

        return (
          <div
            key={fullDate}
            className={className}
          >
            {date}
          </div>
        );
      })}
      <div
        className={selectorClassName}
        style={{ left: `calc(5px + ${todaysIndex} * 50px)` }}
      />
    </div>
  );
}
