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
  displayingYesterday: boolean;
  setView: React.Dispatch<React.SetStateAction<View>>;
  setDisplayingYesterday: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: (newIndex: number | null) => void;
  setFocusId: React.Dispatch<React.SetStateAction<number | undefined>>;
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
    displayingYesterday,
    setView,
    setDisplayingYesterday,
    setSelectedIndex,
    setFocusId,
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
      setView('habit');
      setDisplayingYesterday(false);
      const newSelectedHabits = getSelectedHabits({
        dayObject: dateObject.today,
        habits,
        occurrenceData,
        listView: 'habit',
      });
      if (newSelectedHabits.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(0);
      }
      setFocusId(undefined);
    },
    yesterday: () => {
      e.preventDefault();
      setView('habit');
      setDisplayingYesterday(true);
      const newSelectedHabits = getSelectedHabits({
        dayObject: dateObject.yesterday,
        habits,
        occurrenceData,
        listView: 'habit',
      });
      if (newSelectedHabits.length === 0) {
        setSelectedIndex(null);
      } else {
        setSelectedIndex(0);
      }
      setFocusId(undefined);
    },
    selection: () => {
      e.preventDefault();
      setView('selection');
      setDisplayingYesterday(false);
      setSelectedIndex(0);
      setFocusId(undefined);
    },
    history: () => {
      e.preventDefault();
      setView('history');
      setDisplayingYesterday(false);
      setFocusId(undefined);
    },
    focus: () => {
      e.preventDefault();
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      setView('history');
      setDisplayingYesterday(false);
      setFocusId(selectedHabit.id);
    },
    incrementSelectedIndex: () => {
      e.preventDefault();
      setInInput(false);

      if (habits.length === 0 && view === 'selection') {
        if (selectedIndex === null) {
          setSelectedIndex(0);
          return;
        }
        setSelectedIndex(null);
        return;
      }

      const maxIndex = view === 'habit' ? selectedHabits.length - 1 : selectedHabits.length;
      const newIndex = selectedIndex === null ? null
        : Math.min(selectedIndex + 1, maxIndex);
      setSelectedIndex(newIndex);
    },
    decrementSelectedIndex: () => {
      e.preventDefault();
      setInInput(false);

      if (habits.length === 0 && view === 'selection') {
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
    if (key === 'ArrowDown' && view !== 'history') shortcuts.incrementSelectedIndex();
    if (key === 'ArrowUp' && view !== 'history') shortcuts.decrementSelectedIndex();
    if (!inInput) {
      if (noModifierKeysPressed(e)) {
        if (key === 't' && !inTransition && (displayingYesterday !== false || view !== 'habit')) shortcuts.today();
        if (key === 'y' && !inTransition && (displayingYesterday !== true || view !== 'habit')) shortcuts.yesterday();
        if (key === 's' && !inTransition && view !== 'selection') shortcuts.selection();
        if (key === 'h' && !inTransition && view !== 'history') shortcuts.history();
        if (key === 'f' && !inTransition && view !== 'history') shortcuts.focus();
        if (key === 'Enter' && view === 'habit') shortcuts.updateHabitCompleted();
        if (key === 'c' && view === 'selection') shortcuts.createHabit();
        if (key === 'v' && view === 'selection') shortcuts.updateHabitVisibility();
        if (key === 'Backspace' && view === 'selection') shortcuts.removeHabit();
        if (key === 'r' && view === 'selection' && selectedIndex !== habits.length) shortcuts.renameHabit();
      }
    } else {
      // can refactor this later once all keyboard shortcuts are there
      if (noModifierKeysPressed(e)) { // eslint-disable-line no-lonely-if
        if (key === 'Escape' && view === 'selection' && selectedIndex === habits.length) shortcuts.escapeCreateInput();
        if (key === 'Escape' && view === 'selection' && selectedIndex !== habits.length) shortcuts.escapeRenameHabit();
      }
    }
  }
}
