import { useCallback, useEffect } from 'react';
import {
  DateObject, Habit, ListView, ModalContentGenerator, OccurrenceData, View,
} from '../../globalTypes';
import noModifierKeysPressed from './noModifierKeysPressed';
import {
  escapeCreateHabitInput,
  escapeRenameHabitInput,
  incrementSelectedIndex,
  moveToCreateHabitInput,
  removeCurrentHabit,
  renameCurrentHabit,
  toggleCurrentHabitCompleted,
  toggleCurrentHabitVisibility,
  transitionToView,
} from './shortcuts';

type States = {
  dateObject: DateObject;
  latchedListView: ListView;
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
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useShortcutManager(states: States) {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const {
      view,
      inTransition,
      inInput,
      selectedIndex,
      habits,
      reorderingList,
    } = states;

    if (!habits) return;

    const { key } = e;

    let shortcut: undefined | (() => void);

    if (reorderingList || !noModifierKeysPressed(e)) return;

    if (key === 'ArrowDown' && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => incrementSelectedIndex(1, states);
    if (key === 'ArrowUp' && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => incrementSelectedIndex(-1, states);

    if (!inInput) {
      if (!inTransition) {
        if (key === 't' && view.name !== 'today') shortcut = () => transitionToView('today', states);
        if (key === 'y' && view.name !== 'yesterday') shortcut = () => transitionToView('yesterday', states);
        if (key === 's' && view.name !== 'selection') shortcut = () => transitionToView('selection', states);
        if (key === 'h' && view.name !== 'history') shortcut = () => transitionToView('history', states);
        if (key === 'f' && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => transitionToView('focus', states);
      }

      if (key === 'Enter' && (view.name === 'today' || view.name === 'yesterday')) shortcut = () => toggleCurrentHabitCompleted(states); // this would throw if you allow it in selection view
      if (key === 'c' && view.name === 'selection') shortcut = () => moveToCreateHabitInput(states);
      if (key === 'v' && view.name === 'selection') shortcut = () => toggleCurrentHabitVisibility(states);
      if (key === 'Backspace' && view.name === 'selection') shortcut = () => removeCurrentHabit(states);
      if (key === 'r' && view.name === 'selection' && selectedIndex !== habits.length) shortcut = () => renameCurrentHabit(states);
    } else {
      if (key === 'Escape' && view.name === 'selection' && selectedIndex === habits.length) shortcut = () => escapeCreateHabitInput(states);
      if (key === 'Escape' && view.name === 'selection' && selectedIndex !== habits.length) shortcut = () => escapeRenameHabitInput(states);
    }

    if (shortcut === undefined) return;

    e.preventDefault();
    shortcut();
  }, [states]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
}
