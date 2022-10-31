import React from 'react';
import { Occurrence } from '../../globalTypes';
import './occurrences.css';

function getContainerHeight(occurencesLength: number) {
  return Math.ceil(occurencesLength / 7) * 50;
}

const seededRandom = [0.93, 0.88, 0.26, 0.85, 0.56, 0.93, 0.19, 0.37, 0.27, 0.61];

function getAnimationDelay(row: number, index: number) {
  return 38 * row + 200 * seededRandom[index % seededRandom.length];
}

type OccurrencesProps = {
  occurrences: Occurrence[];
  displayed: boolean;
};

function Occurrences({ occurrences, displayed }: OccurrencesProps) {
  return (
    <div className="occurrence-container" style={{ height: `${getContainerHeight(occurrences.length)}px` }}>
      {occurrences.map(({ date, complete }, index) => {
        // row for fading out not used atm -- temporary for later development
        const row = displayed
          ? Math.floor((occurrences.length - index - 1) / 7)
          : Math.floor(index / 7);
        return (
          <div
            className={`occurrence${complete ? ' complete' : ''}`}
            style={{
              opacity: displayed ? 1 : 0,
              transitionDuration: '600ms',
              transitionDelay: displayed ? `${getAnimationDelay(row, index)}ms` : '0ms',
            }}
          >
            {date}
          </div>
        );
      })}
    </div>
  );
}

export default Occurrences;
