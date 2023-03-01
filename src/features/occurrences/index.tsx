import React, { memo, useMemo, useRef } from 'react';
import {
  View,
  viewToViewType,
  OccurrenceView,
  SelectedOccurrence,
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
  // need the ref for the memo so that it can reference itself
  const latchedOccurrenceViewRef = useRef<OccurrenceView>({ name: 'history' });
  const latchedOccurrenceView: OccurrenceView = useMemo(() => {
    const isOccurrenceView = view.name === 'history' || view.name === 'focus';
    const isDifferentToLast = view.name !== latchedOccurrenceViewRef.current.name;
    const hasDifferentFocusId = view.name === 'focus'
      && latchedOccurrenceViewRef.current.name === 'focus'
      && view.focusId !== latchedOccurrenceViewRef.current.focusId;

    if (isOccurrenceView && (isDifferentToLast || hasDifferentFocusId)) {
      latchedOccurrenceViewRef.current = view;
      return view;
    }
    return latchedOccurrenceViewRef.current;
  }, [view]);

  const displayingOccurrences = viewToViewType[view.name] === 'occurrence';

  const latchedSelectedOccurrencesRef = useRef<SelectedOccurrence[]>([]);
  const latchedSelectedOccurrences = useMemo(() => {
    if (displayingOccurrences) {
      latchedSelectedOccurrencesRef.current = selectedOccurrences;
      return selectedOccurrences;
    }
    return latchedSelectedOccurrencesRef.current;
  }, [displayingOccurrences, selectedOccurrences]);

  const awaitingFirstVisibleRender = useRef(true);

  const component = useMemo(() => {
    let animationName = displayingOccurrences ? 'fade-in' : 'fade-out';

    if (awaitingFirstVisibleRender.current) {
      if (displayingOccurrences) {
        awaitingFirstVisibleRender.current = false;
      } else {
        animationName = '';
      }
    }

    return (
      <div
        className="occurrences"
        style={{ height: `${getContainerHeight(latchedSelectedOccurrences.length)}px` }}
      >
        {latchedSelectedOccurrences
          .map(({ date, fullDate, complete }, index) => {
            const row = Math.floor((latchedSelectedOccurrences.length - index - 1) / 7);

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
  }, [displayingOccurrences, latchedSelectedOccurrences, latchedOccurrenceView]);

  return component;
}

export default memo(Occurrences);
