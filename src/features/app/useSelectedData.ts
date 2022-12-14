import { useMemo } from 'react';
import {
  DateObject,
  Habit,
  OccurrenceData,
  Streaks,
  ListView,
  OccurrenceView,
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
  latchedOccurrenceView: OccurrenceView;
};

export default function useSelectedData(states: States) {
  const {
    habits,
    occurrenceData,
    streaks,
    dateObject,
    latchedListView,
    latchedOccurrenceView,
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
    latchedOccurrenceView,
  }), [dateObject, latchedOccurrenceView, occurrenceData]);

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
