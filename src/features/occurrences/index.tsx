import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  viewToViewType,
  OccurrenceView,
  SelectedOccurrence,
} from '../../globalTypes';
import useLatch from '../common/useLatch';

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
  const occurrenceView = useLatch<OccurrenceView>(
    { name: 'history' },
    useCallback((lastView) => {
      const isOccurrenceView = view.name === 'history' || view.name === 'focus';
      const isDifferentToLast = view.name !== lastView.name;
      const hasDifferentFocusId = (
        view.name === 'focus'
        && lastView.name === 'focus'
        && view.focusId !== lastView.focusId
      );

      if (isOccurrenceView && (isDifferentToLast || hasDifferentFocusId)) {
        return view;
      }
      return lastView;
    }, [view]),
  );

  const displayingOccurrences = viewToViewType[view.name] === 'occurrence';

  const latchedSelectedOccurrences = useLatch<SelectedOccurrence[]>(
    [],
    useCallback((lastSelectedOccurrences) => {
      if (displayingOccurrences) {
        return selectedOccurrences.slice(0, -7);
      }
      return lastSelectedOccurrences;
    }, [displayingOccurrences, selectedOccurrences]),
  );

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

            let className = 'occurrence';
            if (complete) className += ' complete';

            const key = `${occurrenceView.name}-${fullDate}`;

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
  }, [displayingOccurrences, latchedSelectedOccurrences, occurrenceView]);

  return component;
}

export default memo(Occurrences);
