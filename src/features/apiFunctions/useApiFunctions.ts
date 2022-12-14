import { useCallback } from 'react';
import {
  addHabit,
  removeHabit,
  renameHabit,
  updateHabitCompleted,
  updateHabitOrder,
  updateHabitVisibility,
} from '.';
import {
  Habit,
  DateObject,
  DayObject,
  OccurrenceData,
  Streaks,
  ModalContentGenerator,
} from '../../globalTypes';

type States = {
  userId: number;
  dateObject: DateObject;
  dayObject: DayObject;
  displayingYesterday: boolean;
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
};

export default function useApiFunctions(states: States) {
  const {
    userId,
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    selectedIndex,
    setSelectedIndex,
    setModalContentGenerator,
  } = states;

  const addHabitMemo = useCallback((name: string) => (
    addHabit(userId, name, dateObject.today.dateString, {
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
    userId,
  ]);

  const removeHabitMemo = useCallback((habitId: number) => (
    removeHabit(habitId, {
      habits,
      setHabits,
      selectedIndex,
      setSelectedIndex,
      setModalContentGenerator,
    })
  ), [
    habits,
    selectedIndex,
    setHabits,
    setSelectedIndex,
    setModalContentGenerator,
  ]);

  const renameHabitMemo = useCallback((habitId: number, name: string) => (
    renameHabit(habitId, name, { habits, setHabits })
  ), [
    habits,
    setHabits,
  ]);

  const updateHabitCompletedMemo = useCallback((habitId: number, completed: boolean) => (
    updateHabitCompleted(habitId, completed, dayObject.dateString, displayingYesterday, {
      streaks,
      setStreaks,
      occurrenceData,
      setOccurrenceData,
    })
  ), [
    dayObject.dateString,
    displayingYesterday,
    occurrenceData,
    setOccurrenceData,
    setStreaks,
    streaks,
  ]);

  const updateHabitOrderMemo = useCallback((habitId: number, newOrder: number) => (
    updateHabitOrder(habitId, newOrder, { habits, setHabits, setSelectedIndex })
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
    removeHabit: removeHabitMemo,
    renameHabit: renameHabitMemo,
    updateHabitCompleted: updateHabitCompletedMemo,
    updateHabitOrder: updateHabitOrderMemo,
    updateHabitVisibility: updateHabitVisibilityMemo,
  };
}
