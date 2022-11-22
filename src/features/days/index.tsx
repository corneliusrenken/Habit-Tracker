import React from 'react';
import { Occurrence } from '../../globalTypes';
import './days.css';

type Props = {
  weekDays: string[];
  occurrences: Occurrence[];
};

function Days({ weekDays, occurrences }: Props) {
  return (
    <div className="days-container">
      {weekDays.map(((day, index) => {
        const { complete } = occurrences[occurrences.length - 7 + index];
        return (
          <div
            className={`day${complete ? ' greyed-out' : ''}`}
          >
            {day}
          </div>
        );
      }))}
    </div>
  );
}

export default Days;
