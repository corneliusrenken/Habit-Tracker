import React from 'react';
import './dates.css';

function Days({ dates }: { dates: number[] }) {
  return (
    <div className="dates-container">
      <div className="date">{dates[0]}</div>
      <div className="date">{dates[1]}</div>
      <div className="date">{dates[2]}</div>
      <div className="date">{dates[3]}</div>
      <div className="date">{dates[4]}</div>
      <div className="date">{dates[5]}</div>
      <div className="date">{dates[6]}</div>
    </div>
  );
}

export default Days;
