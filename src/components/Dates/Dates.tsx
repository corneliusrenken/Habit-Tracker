import React from 'react';
import { Occurrence } from '../../globalTypes';
import './dates.css';

type Props = {
  occurrences: Occurrence[];
  todaysIndex: number;
};

function Dates({ occurrences, todaysIndex }: Props) {
  return (
    <div className="dates-container">
      {occurrences.slice(occurrences.length - 7).map(({ date, complete }) => (
        <div
          className={`date${complete ? ' greyed-out' : ''}`}
        >
          {date}
        </div>
      ))}
      <div className="date-selector" style={{ left: `calc(5px + ${todaysIndex} * 50px)` }} />
    </div>
  );
}

export default Dates;
