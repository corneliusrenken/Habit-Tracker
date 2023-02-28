import React, { memo, useMemo, useRef } from 'react';
import {
  View,
  SelectedOccurrence,
  viewToViewType,
  OccurrenceView,
} from '../../globalTypes';

function getContainerHeight(occurencesLength: number) {
  return Math.ceil(occurencesLength / 7) * 50;
}

type Props = {
  view: View;
  selectedOccurrences: SelectedOccurrence[];
};

const fadeOffsetSeed = [0.1, 0.3, 0.8, 0.6, 0.9, 0.4, 0.2, 0.7, 0.5, 0.0, 1.0];

function Occurrences({
  view,
  selectedOccurrences,
}: Props) {
  const firstRender = useRef(true);
  // const lastDisplayingOccurrencesValue = useRef(false);
  const displayingOccurrences = viewToViewType[view.name] === 'occurrence';

  // need the ref for the memo so that it can reference itself
  const latchedOccurrenceViewRef = useRef<OccurrenceView>({ name: 'history' });
  const latchedOccurrenceView: OccurrenceView = useMemo(() => {
    if (
      (view.name === 'history' || view.name === 'focus')
      && latchedOccurrenceViewRef.current.name !== view.name
    ) {
      latchedOccurrenceViewRef.current = view;
      return view;
    }
    return latchedOccurrenceViewRef.current;
  }, [view]);

  const occurrences = useMemo(() => {
    console.log('computing occurrences');

    let animationName = displayingOccurrences ? 'fade-in' : 'fade-out';

    if (firstRender.current) {
      firstRender.current = false;
      animationName = '';
    }

    return (
      <div
        className="occurrences"
        style={{ height: `${getContainerHeight(selectedOccurrences.length - 7)}px` }}
      >
        {selectedOccurrences
          .slice(0, selectedOccurrences.length - 7)
          .map(({ date, fullDate, complete }, index) => {
            const row = Math.floor((selectedOccurrences.length - index - 1) / 7);

            let className = 'occurrences-occurrence';
            if (complete) className += ' complete';

            const key = `${latchedOccurrenceView.name}-${fullDate}`;

            return (
              <div
                key={key}
                className={className}
                style={{
                  animationName,
                  animationDelay: displayingOccurrences
                    ? `${38 * row + 100 * fadeOffsetSeed[index % 11]}ms`
                    : '',
                }}
              >
                {date}
              </div>
            );
          })}
      </div>
    );
  }, [displayingOccurrences, selectedOccurrences, latchedOccurrenceView]);

  return occurrences;
}

export default memo(Occurrences);
