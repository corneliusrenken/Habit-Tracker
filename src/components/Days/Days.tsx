import React from 'react';
import './days.css';

type Props = {
  weekDays: string[];
};

function Days({ weekDays }: Props) {
  return (
    <div className="days-container">
      {weekDays.map(((day) => (
        <div
          className="day"
        >
          {day}
        </div>
      )))}
    </div>
  );
}

export default Days;
