import React from 'react';
import { SelectedOccurrence } from '../../globalTypes';
import './dates.css';

type Props = {
  selectedOccurrences: SelectedOccurrence[];
  todaysIndex: number;
};

function Dates({ selectedOccurrences, todaysIndex }: Props) {
  return (
    <div className="dates-container">
      {selectedOccurrences.slice(selectedOccurrences.length - 7).map(({ date, done }, index) => {
        let className = 'date';
        if (done) className += ' greyed-out';

        return (
          <div
            key={index} // eslint-disable-line react/no-array-index-key
            className={className}
          >
            {date}
          </div>
        );
      })}
      <div className="date-selector" style={{ left: `calc(5px + ${todaysIndex} * 50px)` }} />
    </div>
  );
}

export default Dates;
