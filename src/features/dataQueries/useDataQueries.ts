import { useCallback } from 'react';
import {
  addHabit,
  deleteHabit,
  renameHabit,
  updateHabitCompleted,
  updateHabitListPosition,
  updateHabitVisibility,
} from './linkedQueries';
import {
  Habit,
  DateObject,
  DayObject,
  OccurrenceData,
  Streaks,
  ListView,
} from '../../globalTypes';

type States = {
  dateObject: DateObject;
  dayObject: DayObject;
  latchedListView: ListView;
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function useDataQueries(states: States) {
  const {
    dateObject,
    dayObject,
    latchedListView,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    setSelectedIndex,
  } = states;

  const addHabitMemo = useCallback(async (name: string) => (
    addHabit(name, dateObject.today.dateString, {
      habits,
      setHabits,
      occurrenceData,
      setOccurrenceData,
      streaks,
      setStreaks,
    })
  ), [
    dateObject.today.dateString,
    habits,
    occurrenceData,
    setHabits,
    setOccurrenceData,
    setStreaks,
    streaks,
  ]);

  const deleteHabitMemo = useCallback((habitId: number) => (
    deleteHabit(habitId, {
      setHabits,
      setSelectedIndex,
    })
  ), [
    setHabits,
    setSelectedIndex,
  ]);

  const renameHabitMemo = useCallback((habitId: number, name: string) => (
    renameHabit(habitId, name, { habits, setHabits })
  ), [
    habits,
    setHabits,
  ]);

  const updateHabitCompletedMemo = useCallback((habitId: number, completed: boolean) => (
    updateHabitCompleted(habitId, completed, dayObject.dateString, latchedListView.name === 'yesterday', {
      streaks,
      setStreaks,
      occurrenceData,
      setOccurrenceData,
    })
  ), [
    dayObject.dateString,
    latchedListView,
    occurrenceData,
    setOccurrenceData,
    setStreaks,
    streaks,
  ]);

  const updateHabitListPositionMemo = useCallback((habitId: number, newListPosition: number) => (
    updateHabitListPosition(habitId, newListPosition, { habits, setHabits, setSelectedIndex })
  ), [
    habits,
    setHabits,
    setSelectedIndex,
  ]);

  const updateHabitVisibilityMemo = useCallback((habitId: number, visible: boolean) => (
    updateHabitVisibility(habitId, visible, dateObject.today.dateString, {
      streaks,
      setStreaks,
      occurrenceData,
      setOccurrenceData,
    })
  ), [
    dateObject.today.dateString,
    occurrenceData,
    setOccurrenceData,
    setStreaks,
    streaks,
  ]);

  return {
    addHabit: addHabitMemo,
    deleteHabit: deleteHabitMemo,
    renameHabit: renameHabitMemo,
    updateHabitCompleted: updateHabitCompletedMemo,
    updateHabitListPosition: updateHabitListPositionMemo,
    updateHabitVisibility: updateHabitVisibilityMemo,
  };
}
