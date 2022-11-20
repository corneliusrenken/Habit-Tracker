import React from 'react';
import './days.css';

function Days() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="days-container">
      {days.map(((day) => (
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
