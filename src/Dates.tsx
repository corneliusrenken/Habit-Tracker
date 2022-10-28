import React, { useEffect, useRef } from 'react';
import './dates.css';

type DaysProps = {
  dates: number[];
  todaysIndex: number;
};

function Days({ dates, todaysIndex }: DaysProps) {
  const dateSelector = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dateSelector.current) {
      dateSelector.current.style.setProperty('--todays-index', todaysIndex.toString());
    }
  }, [dateSelector, todaysIndex]);

  return (
    <div className="dates-container">
      <div className="date">{dates[0]}</div>
      <div className="date">{dates[1]}</div>
      <div className="date">{dates[2]}</div>
      <div className="date">{dates[3]}</div>
      <div className="date">{dates[4]}</div>
      <div className="date">{dates[5]}</div>
      <div className="date">{dates[6]}</div>
      <div className="date-selector" ref={dateSelector} />
    </div>
  );
}

export default Days;
