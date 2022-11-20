import React from 'react';
import './dates.css';

type Props = {
  dates: number[];
  todaysIndex: number;
};

function Dates({ dates, todaysIndex }: Props) {
  return (
    <div className="dates-container">
      {dates.map((date) => <div className="date">{date}</div>)}
      <div className="date-selector" style={{ left: `calc(5px + ${todaysIndex} * 50px)` }} />
    </div>
  );
}

export default Dates;
