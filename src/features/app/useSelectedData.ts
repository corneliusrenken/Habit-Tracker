import { useMemo } from 'react';
import {
  DateObject,
  DayObject,
  Habit,
  ListView,
  OccurrenceData,
  Streaks,
} from '../../globalTypes';
import getSelectedHabits from './getSelectedHabits';
import getSelectedOccurrences from './getSelectedOccurrences';
import getSelectedStreaks from './getSelectedStreaks';

type States = {
  habits: Habit[] | undefined;
  occurrenceData: OccurrenceData | undefined;
  streaks: Streaks | undefined;
  dateObject: DateObject;
  dayObject: DayObject;
  displayingYesterday: boolean;
  listView: ListView;
  focusId: number | undefined;
};

export default function useSelectedData(states: States) {
  const {
    habits,
    occurrenceData,
    streaks,
    dateObject,
    dayObject,
    displayingYesterday,
    listView,
    focusId,
  } = states;

  const selectedHabits = useMemo(() => getSelectedHabits({
    habits,
    occurrenceData,
    dayObject,
    listView,
  }), [dayObject, habits, listView, occurrenceData]);

  const selectedOccurrences = useMemo(() => getSelectedOccurrences({
    occurrenceData,
    focusId,
    dayObject,
  }), [occurrenceData, dayObject, focusId]);

  const selectedStreaks = useMemo(() => getSelectedStreaks({
    dateObject,
    displayingYesterday,
    occurrenceData,
    streaks,
  }), [dateObject, displayingYesterday, occurrenceData, streaks]);

  return {
    habits: selectedHabits,
    occurrences: selectedOccurrences,
    streaks: selectedStreaks,
  };
}
