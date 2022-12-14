import {
  DateObject,
  DayObject,
  Habit,
  OccurrenceData,
  View,
} from '../../globalTypes';
import getSelectedHabits from './getSelectedHabits';

function noModifierKeysPressed(e: KeyboardEvent) {
  return (
    e.getModifierState('Alt') === false
    && e.getModifierState('AltGraph') === false
    && e.getModifierState('Control') === false
    && e.getModifierState('Meta') === false
    && e.getModifierState('OS') === false
    && e.getModifierState('Shift') === false
  );
}

type States = {
  dateObject: DateObject;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIndex: number | null;
  habits: Habit[];
  selectedHabits: Habit[];
  view: View;
  setView: (newView: View) => void;
  setSelectedIndex: (newIndex: number | null) => void;
  inTransition: boolean;
  dayObject: DayObject;
  occurrenceData: OccurrenceData;
  reorderingList: boolean;
  removeHabit: (habitId: number) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function shortcutManager(e: KeyboardEvent, states: States) {
  const {
    dateObject,
    inInput,
    setInInput,
    selectedIndex,
    habits,
    selectedHabits,
    view,
    setView,
    setSelectedIndex,
    inTransition,
    dayObject,
    occurrenceData,
    reorderingList,
    removeHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  } = states;
  const { key } = e;

  const shortcuts = {
    today: () => {
      e.preventDefault();
      setView({ name: 'today' });
      const newSelectedHabits = getSelectedHabits({
        dateObject,
        habits,
        occurrenceData,
        latchedListView: { name: 'today' },
      });
      if (newSelectedHabits.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(0);
      }
    },
    yesterday: () => {
      e.preventDefault();
      setView({ name: 'yesterday' });
      const newSelectedHabits = getSelectedHabits({
        dateObject,
        habits,
        occurrenceData,
        latchedListView: { name: 'yesterday' },
      });
      if (newSelectedHabits.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(0);
      }
    },
    selection: () => {
      e.preventDefault();
      setView({ name: 'selection' });
      setSelectedIndex(0);
    },
    history: () => {
      e.preventDefault();
      setView({ name: 'history' });
    },
    focus: () => {
      e.preventDefault();
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      setView({ name: 'focus', focusId: selectedHabit.id });
    },
    incrementSelectedIndex: () => {
      e.preventDefault();
      setInInput(false);

      if (habits.length === 0 && view.name === 'selection') {
        if (selectedIndex === null) {
          setSelectedIndex(0);
          return;
        }
        setSelectedIndex(null);
        return;
      }

      const maxIndex = view.name === 'today' || view.name === 'yesterday' ? selectedHabits.length - 1 : selectedHabits.length;
      const newIndex = selectedIndex === null ? null
        : Math.min(selectedIndex + 1, maxIndex);
      setSelectedIndex(newIndex);
    },
    decrementSelectedIndex: () => {
      e.preventDefault();
      setInInput(false);

      if (habits.length === 0 && view.name === 'selection') {
        if (selectedIndex === null) {
          setSelectedIndex(0);
          return;
        }
        setSelectedIndex(null);
        return;
      }

      const newIndex = selectedIndex === null ? null
        : Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
    },
    createHabit: () => {
      e.preventDefault();
      setSelectedIndex(habits.length);
    },
    updateHabitCompleted: () => {
      e.preventDefault();
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      const currentCompletedState = occurrenceData.dates[dayObject.dateString][selectedHabit.id];
      updateHabitCompleted(selectedHabit.id, !currentCompletedState);
    },
    updateHabitVisibility: () => {
      e.preventDefault();
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      // this should not really be dayobject, but date obect, have a look later
      // eslint-disable-next-line max-len
      const currentVisibility = occurrenceData.dates[dayObject.dateString][selectedHabit.id] !== undefined;
      updateHabitVisibility(selectedHabit.id, !currentVisibility);
    },
    removeHabit: () => {
      e.preventDefault();
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      removeHabit(selectedHabit.id);
    },
    renameHabit: () => {
      e.preventDefault();
      setInInput(true);
    },
    escapeCreateInput: () => {
      e.preventDefault();
      setInInput(false);
      if (habits.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(habits.length - 1);
      }
    },
    escapeRenameHabit: () => {
      e.preventDefault();
      setInInput(false);
    },
  };

  // this could return out at the very top, keeping it nested for readability rn
  if (!reorderingList) {
    if (key === 'ArrowDown' && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcuts.incrementSelectedIndex();
    if (key === 'ArrowUp' && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcuts.decrementSelectedIndex();
    if (!inInput) {
      if (noModifierKeysPressed(e)) {
        if (key === 't' && !inTransition && view.name !== 'today') shortcuts.today();
        if (key === 'y' && !inTransition && view.name !== 'yesterday') shortcuts.yesterday();
        if (key === 's' && !inTransition && view.name !== 'selection') shortcuts.selection();
        if (key === 'h' && !inTransition && view.name !== 'history') shortcuts.history();
        if (key === 'f' && !inTransition && (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection')) shortcuts.focus();
        if (key === 'Enter' && (view.name === 'today' || view.name === 'yesterday')) shortcuts.updateHabitCompleted();
        if (key === 'c' && view.name === 'selection') shortcuts.createHabit();
        if (key === 'v' && view.name === 'selection') shortcuts.updateHabitVisibility();
        if (key === 'Backspace' && view.name === 'selection') shortcuts.removeHabit();
        if (key === 'r' && view.name === 'selection' && selectedIndex !== habits.length) shortcuts.renameHabit();
      }
    } else {
      // can refactor this later once all keyboard shortcuts are there
      if (noModifierKeysPressed(e)) { // eslint-disable-line no-lonely-if
        if (key === 'Escape' && view.name === 'selection' && selectedIndex === habits.length) shortcuts.escapeCreateInput();
        if (key === 'Escape' && view.name === 'selection' && selectedIndex !== habits.length) shortcuts.escapeRenameHabit();
      }
    }
  }
}
