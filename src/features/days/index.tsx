import React from 'react';
import { SelectedOccurrence } from '../../globalTypes';
import './days.css';

type Props = {
  weekDays: string[];
  selectedOccurrences: SelectedOccurrence[];
};

export default function Days({ weekDays, selectedOccurrences }: Props) {
  return (
    <div className="days-container">
      {weekDays.map(((day, index) => {
        const { done } = selectedOccurrences[selectedOccurrences.length - 7 + index];
        let className = 'day';
        if (done) className += ' greyed-out';

        return (
          <div
            key={index} // eslint-disable-line react/no-array-index-key
            className={className}
          >
            {day}
          </div>
        );
      }))}
    </div>
  );
}
