import { useCallback } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
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

// Refactor TODO: create a custom hook that takes
// - dispatcher, showBoundary, states
// and returns
// - the memoized version including error handling etc.

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

  const { showBoundary } = useErrorBoundary();

  const selectedDate = view.name === 'yesterday'
    ? dateObject.yesterday.dateString
    : dateObject.today.dateString;

  const addHabitMemo = useCallback((
    name: string,
  ) => {
    try {
      addHabit(name, dateObject.today.dateString, {
        queue,
        habits,
        streaks,
        occurrenceData,
        setHabits,
        setStreaks,
        setOccurrenceData,
        setSelectedIndex,
      });
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
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
  ) => {
    try {
      deleteHabit(habitId, {
        queue,
        habits,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setSelectedIndex,
        setInInput,
      });
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
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
  ) => {
    try {
      updateHabitListPosition(habitId, newPosition, {
        queue,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setSelectedIndex,
      });
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
    queue,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
  ]);

  const updateHabitNameMemo = useCallback((
    habitId: number,
    newName: string,
  ) => {
    try {
      updateHabitName(habitId, newName, {
        queue,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setSelectedIndex,
      });
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
    queue,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
  ]);

  const updateOccurrenceCompletedMemo = useCallback((
    habitId: number,
    complete: boolean,
  ) => {
    try {
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
      );
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
    dateObject,
    selectedDate,
    queue,
    setOccurrenceData,
    setStreaks,
  ]);

  const updateOccurrenceVisibilityMemo = useCallback((
    habitId: number,
    visible: boolean,
  ) => {
    try {
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
      );
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
    dateObject,
    selectedDate,
    queue,
    occurrenceData,
    setStreaks,
    setOccurrenceData,
  ]);

  const updateConfigMemo = useCallback((
    updateData: Parameters<typeof window.electron['update-config']>[0],
  ) => {
    try {
      updateConfig(
        updateData,
        { queue, setConfig },
      );
    } catch (error) {
      if (error instanceof Error) {
        showBoundary(error);
      } else {
        showBoundary(new Error('Unknown error in task dispatcher'));
      }
    }
  }, [
    showBoundary,
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
