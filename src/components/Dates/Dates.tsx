import React from 'react';
import './dates.css';

type Props = {
  weekDateStrings: string[];
  todaysIndex: number;
};

function Dates({ weekDateStrings, todaysIndex }: Props) {
  return (
    <div className="dates-container">
      {weekDateStrings.map((dateString) => <div className="date">{Number(dateString.slice(-2))}</div>)}
      <div className="date-selector" style={{ left: `calc(5px + ${todaysIndex} * 50px)` }} />
    </div>
  );
}

export default Dates;
