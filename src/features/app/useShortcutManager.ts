import { useEffect } from 'react';
import {
  DateObject, DayObject, Habit, OccurrenceData, View,
} from '../../globalTypes';
import shortcutManager from './shortcutManager';

type States = {
  dateObject: DateObject;
  dayObject: DayObject;
  habits: Habit[] | undefined;
  inInput: boolean;
  inTransition: boolean;
  occurrenceData: OccurrenceData | undefined;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  view: View;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setView: (newView: View) => void;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  reorderingList: boolean;
  removeHabit: (habitId: number) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useShortcutManager(states: States) {
  const {
    dateObject,
    dayObject,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setSelectedIndex,
    reorderingList,
    removeHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  } = states;

  useEffect(() => {
    if (!habits || !occurrenceData) return;

    const onKeyDown = (e: KeyboardEvent) => shortcutManager(e, {
      dateObject,
      dayObject,
      habits,
      inInput,
      inTransition,
      occurrenceData,
      selectedHabits,
      selectedIndex,
      view,
      setInInput,
      setView,
      setSelectedIndex,
      reorderingList,
      removeHabit,
      updateHabitCompleted,
      updateHabitVisibility,
    });

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown); // eslint-disable-line consistent-return, max-len
  }, [
    dateObject,
    dayObject,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setSelectedIndex,
    reorderingList,
    removeHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  ]);
}
