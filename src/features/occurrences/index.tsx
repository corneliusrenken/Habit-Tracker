import React from 'react';
import { SelectedOccurrence } from '../../globalTypes';
import './occurrences.css';

function getContainerHeight(occurencesLength: number) {
  return Math.ceil(occurencesLength / 7) * 50;
}

const seededRandom = [0.93, 0.88, 0.26, 0.85, 0.56, 0.93, 0.19, 0.37, 0.27, 0.61];

function getAnimationDelay(row: number, index: number) {
  return 38 * row + 200 * seededRandom[index % seededRandom.length];
}

type Props = {
  selectedOccurrences: SelectedOccurrence[];
  displayed: boolean;
};

export default function Occurrences({ selectedOccurrences, displayed }: Props) {
  return (
    <div
      className="occurrence-container"
      style={{ height: `${getContainerHeight(selectedOccurrences.length - 7)}px` }}
    >
      {selectedOccurrences.slice(0, selectedOccurrences.length - 7).map(({ date, done }, index) => {
        // row for fading out not used atm -- temporary for later development
        const row = displayed
          ? Math.floor((selectedOccurrences.length - index - 1) / 7)
          : Math.floor(index / 7);

        let className = 'occurrence';
        if (done) className += ' greyed-out';

        return (
          <div
            key={index} // eslint-disable-line react/no-array-index-key
            className={className}
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
