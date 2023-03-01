import { useMemo, useRef } from 'react';
import {
  DateObject,
  Habit,
  ListView,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import getSelectedHabits from './getSelectedHabits';
import getSelectedOccurrences from './getSelectedOccurrences';
import getSelectedStreaks from './getSelectedStreaks';

type States = {
  view: View;
  dateObject: DateObject;
  occurrenceData: OccurrenceData;
  habits: Habit[];
  streaks: Streaks;
};

export default function useSelectedData({
  view,
  dateObject,
  occurrenceData,
  habits,
  streaks,
}: States) {
  // need the ref for the memo so that it can reference itself
  const latchedListViewRef = useRef<ListView>({ name: 'today' });
  const latchedListView: ListView = useMemo(() => {
    const isListView = view.name === 'today' || view.name === 'yesterday' || view.name === 'selection';
    const isDifferentToLast = view.name !== latchedListViewRef.current.name;

    if (isListView && isDifferentToLast) {
      latchedListViewRef.current = view;
      return view;
    }
    return latchedListViewRef.current;
  }, [view]);

  // need the ref for the memo so that it can reference itself
  // const latchedOccurrenceViewRef = useRef<OccurrenceView>({ name: 'history' });
  // const latchedOccurrenceView: OccurrenceView = useMemo(() => {
  //   const isOccurrenceView = view.name === 'history' || view.name === 'focus';
  //   const isDifferentToLast = view.name !== latchedOccurrenceViewRef.current.name;
  //   const hasDifferentFocusId = view.name === 'focus'
  //     && latchedOccurrenceViewRef.current.name === 'focus'
  //     && view.focusId !== latchedOccurrenceViewRef.current.focusId;

  //   if (isOccurrenceView && (isDifferentToLast || hasDifferentFocusId)) {
  //     latchedOccurrenceViewRef.current = view;
  //     return view;
  //   }
  //   return latchedOccurrenceViewRef.current;
  // }, [view]);

  const selectedHabits = useMemo(() => getSelectedHabits({
    listView: latchedListView,
    dateObject,
    occurrenceData,
    habits,
  }), [dateObject, habits, latchedListView, occurrenceData]);

  // refactor this later, don't need to recalculate the whole thing for each view
  // only need to recalculate the last 7, the rest is latched
  const selectedOccurrences = useMemo(() => getSelectedOccurrences({
    view,
    dateObject,
    occurrenceData,
  }), [dateObject, occurrenceData, view]);

  const selectedStreaks = useMemo(() => getSelectedStreaks({
    listView: latchedListView,
    dateObject,
    occurrenceData,
    streaks,
  }), [dateObject, latchedListView, occurrenceData, streaks]);

  return {
    selectedHabits,
    selectedOccurrences,
    selectedStreaks,
  };
}
