import { useCallback } from 'react';
import {
  addHabit,
  deleteHabit,
  updateHabitListPosition,
  updateConfig,
  updateHabitName,
  updateOccurrenceCompleted,
  updateOccurrenceVisibility,
} from './dispatchers';
import {
  Habit,
  DateObject,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import TaskQueue from '../taskQueue';
import { Config } from '../../api/config/defaultConfig';

type States = {
  queue: TaskQueue;
  dateObject: DateObject;
  view: View;
  habits: Habit[];
  occurrenceData: OccurrenceData;
  streaks: Streaks;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function useDataQueries(states: States) {
  const {
    queue,
    dateObject,
    view,
    habits,
    occurrenceData,
    streaks,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
    setInInput,
    setConfig,
  } = states;

  const selectedDate = view.name === 'yesterday'
    ? dateObject.yesterday.dateString
    : dateObject.today.dateString;

  const addHabitMemo = useCallback((
    name: string,
  ) => (
    addHabit(name, dateObject.today.dateString, {
      queue,
      habits,
      streaks,
      occurrenceData,
      setHabits,
      setStreaks,
      setOccurrenceData,
      setSelectedIndex,
    })
  ), [
    dateObject.today.dateString,
    queue,
    habits,
    streaks,
    occurrenceData,
    setHabits,
    setStreaks,
    setOccurrenceData,
    setSelectedIndex,
  ]);

  const deleteHabitMemo = useCallback((
    habitId: number,
  ) => (
    deleteHabit(habitId, {
      queue,
      habits,
      setHabits,
      setOccurrenceData,
      setStreaks,
      setSelectedIndex,
      setInInput,
    })
  ), [
    queue,
    habits,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
    setInInput,
  ]);

  const updateHabitListPositionMemo = useCallback((
    habitId: number,
    newPosition: number,
  ) => (
    updateHabitListPosition(habitId, newPosition, {
      queue,
      setHabits,
      setOccurrenceData,
      setStreaks,
      setSelectedIndex,
    })
  ), [
    queue,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
  ]);

  const updateHabitNameMemo = useCallback((
    habitId: number,
    newName: string,
  ) => (
    updateHabitName(habitId, newName, {
      queue,
      setHabits,
      setOccurrenceData,
      setStreaks,
      setSelectedIndex,
    })
  ), [
    queue,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
  ]);

  const updateOccurrenceCompletedMemo = useCallback((
    habitId: number,
    complete: boolean,
  ) => (
    updateOccurrenceCompleted(
      habitId,
      complete,
      selectedDate,
      dateObject.today.dateString,
      {
        queue,
        setOccurrenceData,
        setStreaks,
      },
    )
  ), [
    dateObject,
    selectedDate,
    queue,
    setOccurrenceData,
    setStreaks,
  ]);

  const updateOccurrenceVisibilityMemo = useCallback((
    habitId: number,
    visible: boolean,
  ) => (
    updateOccurrenceVisibility(
      habitId,
      visible,
      selectedDate,
      dateObject.today.dateString,
      {
        queue,
        occurrenceData,
        setStreaks,
        setOccurrenceData,
      },
    )
  ), [
    dateObject,
    selectedDate,
    queue,
    occurrenceData,
    setStreaks,
    setOccurrenceData,
  ]);

  const updateConfigMemo = useCallback((
    updateData: Partial<Config>,
  ) => (
    updateConfig(
      updateData,
      { queue, setConfig },
    )
  ), [
    queue,
    setConfig,
  ]);

  return {
    addHabit: addHabitMemo,
    deleteHabit: deleteHabitMemo,
    updateHabitListPosition: updateHabitListPositionMemo,
    updateHabitName: updateHabitNameMemo,
    updateOccurrenceCompleted: updateOccurrenceCompletedMemo,
    updateOccurrenceVisibility: updateOccurrenceVisibilityMemo,
    updateConfig: updateConfigMemo,
  };
}
