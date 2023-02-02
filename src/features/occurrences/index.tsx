import React, { useEffect, useRef, useState } from 'react';
import { OccurrenceView, SelectedOccurrence, ViewType } from '../../globalTypes';

function getContainerHeight(occurencesLength: number) {
  return Math.ceil(occurencesLength / 7) * 50;
}

type Props = {
  latchedOccurrenceView: OccurrenceView;
  viewType: ViewType;
  selectedOccurrences: SelectedOccurrence[];
};

export default function Occurrences({
  latchedOccurrenceView,
  viewType,
  selectedOccurrences,
}: Props) {
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
      className="occurrences"
      style={{ height: `${getContainerHeight(selectedOccurrences.length - 7)}px` }}
    >
      {selectedOccurrences
        .slice(0, selectedOccurrences.length - 7)
        .map(({ date, fullDate, complete }, index) => {
          const row = Math.floor((selectedOccurrences.length - index - 1) / 7);

          let className = 'occurrences-occurrence';
          if (complete) className += ' greyed-out';

          const key = `${latchedOccurrenceView.name}-${fullDate}`;

          return (
            <div
              key={key}
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
