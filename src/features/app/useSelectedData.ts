import { useMemo } from 'react';
import {
  DateObject,
  Habit,
  OccurrenceData,
  Streaks,
  ListView,
  View,
} from '../../globalTypes';
import getSelectedHabits from './getSelectedHabits';
import getSelectedOccurrences from './getSelectedOccurrences';
import getSelectedStreaks from './getSelectedStreaks';

type States = {
  habits: Habit[] | undefined;
  occurrenceData: OccurrenceData | undefined;
  streaks: Streaks | undefined;
  dateObject: DateObject;
  latchedListView: ListView;
  view: View;
};

export default function useSelectedData(states: States) {
  const {
    habits,
    occurrenceData,
    streaks,
    dateObject,
    latchedListView,
    view,
  } = states;

  const selectedHabits = useMemo(() => getSelectedHabits({
    habits,
    occurrenceData,
    dateObject,
    latchedListView,
  }), [dateObject, habits, latchedListView, occurrenceData]);

  const selectedOccurrences = useMemo(() => getSelectedOccurrences({
    occurrenceData,
    dateObject,
    view,
  }), [dateObject, view, occurrenceData]);

  const selectedStreaks = useMemo(() => getSelectedStreaks({
    dateObject,
    latchedListView,
    occurrenceData,
    streaks,
  }), [dateObject, latchedListView, occurrenceData, streaks]);

  return {
    habits: selectedHabits,
    occurrences: selectedOccurrences,
    streaks: selectedStreaks,
  };
}
