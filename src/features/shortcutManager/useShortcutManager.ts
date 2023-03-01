import { useCallback, useEffect } from 'react';
import {
  DateObject, Habit, ListView, ModalContentGenerator, OccurrenceData, View,
} from '../../globalTypes';
import checkModifierKeyWhitelist from './checkModifierKeyWhitelist';
import {
  escapeCreateHabitInput,
  escapeRenameHabitInput,
  incrementSelectedIndex,
  moveToCreateHabitInput,
  removeCurrentHabit,
  renameCurrentHabit,
  reorderHabit,
  toggleCurrentHabitCompleted,
  toggleCurrentHabitVisibility,
  transitionToView,
} from './shortcuts';

type States = {
  modalContentGenerator: ModalContentGenerator | undefined;
  setIgnoreMouse: React.Dispatch<React.SetStateAction<boolean>>;
  dateObject: DateObject;
  latchedListView: ListView;
  habits: Habit[];
  inInput: boolean;
  inTransition: boolean;
  occurrenceData: OccurrenceData;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  view: View;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setView: (nextView: View | ((lastView: View) => View)) => void;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  reorderingList: boolean;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
  updateHabitListPosition(habitId: number, listPosition: number): void;
};

export default function useShortcutManager(states: States) {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const {
      modalContentGenerator,
      setIgnoreMouse,
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

    if (reorderingList || modalContentGenerator) return;

    if (key === 'ArrowDown' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => incrementSelectedIndex(1, states);
    if (key === 'ArrowUp' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => incrementSelectedIndex(-1, states);

    if (!inInput) {
      if (!inTransition) {
        if (key === 't' && checkModifierKeyWhitelist(e) && view.name !== 'today') shortcut = () => transitionToView('today', states);
        if (key === 'y' && checkModifierKeyWhitelist(e) && view.name !== 'yesterday') shortcut = () => transitionToView('yesterday', states);
        if (key === 's' && checkModifierKeyWhitelist(e) && view.name !== 'selection') shortcut = () => transitionToView('selection', states);
        if (key === 'h' && checkModifierKeyWhitelist(e) && view.name !== 'history') shortcut = () => transitionToView('history', states);
        if (key === 'f' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => transitionToView('focus', states);
      }

      if (key === 'Enter' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday')) shortcut = () => toggleCurrentHabitCompleted(states); // this would throw if you allow it in selection view
      if (key === 'c' && checkModifierKeyWhitelist(e) && view.name === 'selection') shortcut = () => moveToCreateHabitInput(states);
      if (key === 'v' && checkModifierKeyWhitelist(e) && view.name === 'selection') shortcut = () => toggleCurrentHabitVisibility(states);
      if (key === 'Backspace' && checkModifierKeyWhitelist(e) && view.name === 'selection') shortcut = () => removeCurrentHabit(states);
      if (key === 'r' && checkModifierKeyWhitelist(e) && view.name === 'selection' && selectedIndex !== habits.length) shortcut = () => renameCurrentHabit(states);
      if (key === 'ArrowDown' && checkModifierKeyWhitelist(e, { alt: true }) && view.name === 'selection') shortcut = () => reorderHabit(1, states);
      if (key === 'ArrowUp' && checkModifierKeyWhitelist(e, { alt: true }) && view.name === 'selection') shortcut = () => reorderHabit(-1, states);
    } else {
      if (key === 'Escape' && checkModifierKeyWhitelist(e) && view.name === 'selection' && selectedIndex === habits.length) shortcut = () => escapeCreateHabitInput(states);
      if (key === 'Escape' && checkModifierKeyWhitelist(e) && view.name === 'selection' && selectedIndex !== habits.length) shortcut = () => escapeRenameHabitInput(states);
    }

    if (shortcut === undefined) return;

    setIgnoreMouse(true);
    e.preventDefault();
    shortcut();
  }, [states]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
}
