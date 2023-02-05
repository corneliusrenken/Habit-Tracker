import React from 'react';
import { DateObject, ListView, SelectedOccurrence } from '../../globalTypes';

type Props = {
  dateObject: DateObject;
  latchedListView: ListView;
  selectedOccurrences: SelectedOccurrence[];
};

export default function Dates({ dateObject, latchedListView, selectedOccurrences }: Props) {
  const selectedDayIndex = latchedListView.name !== 'yesterday'
    ? dateObject.today.weekDayIndex
    : dateObject.yesterday.weekDayIndex;

  const occurrencesForWeek = latchedListView.name === 'yesterday' && selectedDayIndex === 6
    ? selectedOccurrences.slice(selectedOccurrences.length - 14, selectedOccurrences.length - 7)
    : selectedOccurrences.slice(selectedOccurrences.length - 7);

  let selectedDayIndicatorClassName = 'dates-selected-day-indicator';

  if (occurrencesForWeek[selectedDayIndex].complete) {
    selectedDayIndicatorClassName += ' complete';
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
        className={selectedDayIndicatorClassName}
        style={{ left: `calc(${selectedDayIndex} * 50px)` }}
      />
      <div
        className="dates-actual-day-indicator"
        style={{ left: `calc(${dateObject.today.weekDayIndex} * 50px)` }}
      />
    </div>
  );
}
