import React, { useEffect, useRef, useState } from 'react';
import { SelectedOccurrence, ViewType } from '../../globalTypes';
import './occurrences.css';

function getContainerHeight(occurencesLength: number) {
  return Math.ceil(occurencesLength / 7) * 50;
}

type Props = {
  viewType: ViewType;
  selectedOccurrences: SelectedOccurrence[];
};

export default function Occurrences({ viewType, selectedOccurrences }: Props) {
  const occurrenceContainerRef = useRef<HTMLDivElement>(null);
  const [firstTimeShowingOccurrences, setFirstTimeShowingOccurrences] = useState(true);

  useEffect(() => {
    if (firstTimeShowingOccurrences && viewType === 'occurrence') {
      setFirstTimeShowingOccurrences(false);
    } else if (firstTimeShowingOccurrences) {
      return;
    }

    occurrenceContainerRef.current.style.setProperty(
      '--occurrence-animation-name',
      viewType === 'occurrence'
        ? 'fade-in'
        : 'fade-out',
    );
  }, [firstTimeShowingOccurrences, viewType]);

  return (
    <div
      ref={occurrenceContainerRef}
      className="occurrence-container"
      style={{ height: `${getContainerHeight(selectedOccurrences.length - 7)}px` }}
    >
      {selectedOccurrences
        .slice(0, selectedOccurrences.length - 7)
        .map(({ date, complete }, index) => {
          const row = Math.floor((selectedOccurrences.length - index - 1) / 7);

          let className = 'occurrence';
          if (complete) className += ' greyed-out';

          return (
            <div
              key={index} // eslint-disable-line react/no-array-index-key
              className={className}
              style={{
                animationDelay: viewType === 'occurrence'
                  ? `calc(38ms * ${row} + 150ms * var(--animation-delay-multiplier))`
                  : '0ms',
              }}
            >
              {date}
            </div>
          );
        })}
    </div>
  );
}
