import React, { useEffect, useRef } from 'react';
import './dates.css';

type DatesProps = {
  dates: number[];
  todaysIndex: number;
};

function Dates({ dates, todaysIndex }: DatesProps) {
  const dateSelector = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dateSelector.current) {
      dateSelector.current.style.setProperty('--todays-index', todaysIndex.toString());
    }
  }, [dateSelector, todaysIndex]);

  return (
    <div className="dates-container">
      {dates.map((date) => <div className="date">{date}</div>)}
      <div className="date-selector" ref={dateSelector} />
    </div>
  );
}

export default Dates;
