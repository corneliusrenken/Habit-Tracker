import { useCallback, useMemo } from 'react';
import {
  DateObject,
  Habit,
  ListView,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import useLatch from '../common/useLatch';
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
  const listView = useLatch<ListView>(
    { name: 'today' },
    useCallback((prevListView) => {
      if (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection') {
        return view;
      }
      return prevListView;
    }, [view]),
  );

  const selectedHabits = useMemo(() => getSelectedHabits({
    listView,
    dateObject,
    occurrenceData,
    habits,
  }), [dateObject, habits, listView, occurrenceData]);

  // refactor this later, don't need to recalculate the whole thing for each view
  // only need to recalculate the last 7, the rest is latched
  const selectedOccurrences = useMemo(() => getSelectedOccurrences({
    view,
    dateObject,
    occurrenceData,
  }), [dateObject, occurrenceData, view]);

  const selectedStreaks = useMemo(() => getSelectedStreaks({
    listView,
    dateObject,
    occurrenceData,
    streaks,
  }), [dateObject, listView, occurrenceData, streaks]);

  return {
    selectedHabits,
    selectedOccurrences,
    selectedStreaks,
  };
}
