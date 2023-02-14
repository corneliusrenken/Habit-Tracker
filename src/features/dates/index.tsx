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

  const occurrencesForWeek = selectedOccurrences.slice(selectedOccurrences.length - 7);

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
      {occurrencesForWeek[selectedDayIndex].fullDate === dateObject.today.dateString && (
        <div
          className="dates-actual-day-indicator"
          style={{ left: `calc(${dateObject.today.weekDayIndex} * 50px)` }}
        />
      )}
    </div>
  );
}
