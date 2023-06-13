import { useCallback, useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  Config,
  DateObject, Habit, ModalGenerator, OccurrenceData, View,
} from '../../globalTypes';
import checkModifierKeyWhitelist from './checkModifierKeyWhitelist';
import {
  closeModal,
  escapeCreateHabitInput,
  escapeRenameHabitInput,
  incrementSelectedIndex,
  moveToCreateHabitInput,
  openSettings,
  removeCurrentHabit,
  renameCurrentHabit,
  reorderHabit,
  toggleCurrentHabitCompleted,
  toggleCurrentHabitVisibility,
  transitionToView,
} from './shortcuts';

type States = {
  setIgnoreMouse: React.Dispatch<React.SetStateAction<boolean>>;
  dateObject: DateObject;
  habits: Habit[];
  inInput: boolean;
  inTransition: boolean;
  occurrenceData: OccurrenceData;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  view: View;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  reorderingList: boolean;
  modal: ModalGenerator | undefined;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
  updateHabitListPosition(habitId: number, listPosition: number): void;
  updateConfig: (updateData: Partial<Config>) => void;
};

export default function useShortcutManager(disabled: boolean, states: States) {
  const { showBoundary } = useErrorBoundary();

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const {
      modal,
      setIgnoreMouse,
      view,
      inTransition,
      inInput,
      selectedIndex,
      habits,
      reorderingList,
    } = states;

    const { key } = e;

    let shortcut: undefined | (() => void);

    if (reorderingList) return;

    if (modal) {
      if (key === 'Escape') shortcut = () => closeModal(states);
    } else {
      if (key === 'ArrowDown' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => incrementSelectedIndex(1, states);
      if (key === 'ArrowUp' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => incrementSelectedIndex(-1, states);

      if (inInput) {
        if (key === 'Escape' && checkModifierKeyWhitelist(e) && view.name === 'selection' && selectedIndex === habits.length) shortcut = () => escapeCreateHabitInput(states);
        if (key === 'Escape' && checkModifierKeyWhitelist(e) && view.name === 'selection' && selectedIndex !== habits.length) shortcut = () => escapeRenameHabitInput(states);
      } else {
        if (!inTransition) {
          if (key === 't' && checkModifierKeyWhitelist(e) && view.name !== 'today') shortcut = () => transitionToView('today', states);
          if (key === 'y' && checkModifierKeyWhitelist(e) && view.name !== 'yesterday') shortcut = () => transitionToView('yesterday', states);
          if (key === 'e' && checkModifierKeyWhitelist(e) && view.name !== 'selection') shortcut = () => transitionToView('selection', states);
          if (key === 'h' && checkModifierKeyWhitelist(e) && view.name !== 'history') shortcut = () => transitionToView('history', states);
          if (key === 'f' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcut = () => transitionToView('focus', states);
        }
        if (key === ',') shortcut = () => openSettings(states);
        if (key === 'r' && checkModifierKeyWhitelist(e) && view.name === 'selection' && selectedIndex !== habits.length) shortcut = () => renameCurrentHabit(states);
        if (key === 'v' && checkModifierKeyWhitelist(e) && view.name === 'selection') shortcut = () => toggleCurrentHabitVisibility(states);
        if (key === 'c' && checkModifierKeyWhitelist(e) && view.name === 'selection') shortcut = () => moveToCreateHabitInput(states);
        if ((key === 'Backspace' || key === 'Delete') && checkModifierKeyWhitelist(e) && view.name === 'selection') shortcut = () => removeCurrentHabit(states);
        if (key === 'ArrowDown' && checkModifierKeyWhitelist(e, { alt: true }) && view.name === 'selection') shortcut = () => reorderHabit(1, states);
        if (key === 'ArrowUp' && checkModifierKeyWhitelist(e, { alt: true }) && view.name === 'selection') shortcut = () => reorderHabit(-1, states);
        if (key === 'Enter' && checkModifierKeyWhitelist(e) && (view.name === 'today' || view.name === 'yesterday')) shortcut = () => toggleCurrentHabitCompleted(states);
      }
    }

    if (shortcut === undefined) return;

    setIgnoreMouse(true);
    e.preventDefault();

    try {
      shortcut();
    } catch (error) {
      showBoundary(error);
    }
  }, [states, showBoundary]);

  useEffect(() => {
    if (disabled) return;
    window.addEventListener('keydown', onKeyDown);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown, disabled]);
}
