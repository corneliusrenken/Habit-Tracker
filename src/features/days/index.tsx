import React from 'react';
import { SelectedOccurrence, ViewType } from '../../globalTypes';
import './days.css';

type Props = {
  viewType: ViewType;
  weekDays: string[];
  selectedOccurrences: SelectedOccurrence[];
};

export default function Days({ viewType, weekDays, selectedOccurrences }: Props) {
  return (
    <div className="days-container" style={{ opacity: viewType === 'list' ? 1 : 0 }}>
      {weekDays.map(((day, index) => {
        const { complete } = selectedOccurrences[selectedOccurrences.length - 7 + index];
        let className = 'day';
        if (complete) className += ' greyed-out';

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
