import {
  DayObject, Habit, OccurrenceData, View,
} from '../../globalTypes';

type States = {
  inInput: boolean;
  selectedIndex: number;
  habits: Habit[];
  selectedHabits: Habit[];
  view: View;
  displayingYesterday: boolean;
  setView: (v: View) => void;
  setDisplayingYesterday: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: (newIndex: number) => void;
  setFocusId: React.Dispatch<React.SetStateAction<number | undefined>>;
  inTransition: boolean;
  dayObject: DayObject;
  occurrenceData: OccurrenceData;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
};

export default function shortcutManager(e: KeyboardEvent, states: States) {
  const {
    inInput,
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
    updateHabitCompleted,
  } = states;
  const { key } = e;

  const shortcuts = {
    today: () => {
      e.preventDefault();
      setView('habit');
      setDisplayingYesterday(false);
      setSelectedIndex(0);
      setFocusId(undefined);
    },
    yesterday: () => {
      e.preventDefault();
      setView('habit');
      setDisplayingYesterday(true);
      setSelectedIndex(0);
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
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find(({ order }) => order === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      e.preventDefault();
      setView('history');
      setDisplayingYesterday(false);
      setFocusId(selectedHabit.id);
    },
    incrementSelectedIndex: () => {
      e.preventDefault();
      setSelectedIndex(selectedIndex + 1);
    },
    decrementSelectedIndex: () => {
      e.preventDefault();
      setSelectedIndex(selectedIndex - 1);
    },
    createHabit: () => {
      e.preventDefault();
      setSelectedIndex(habits.length);
    },
    updateHabitCompleted: () => {
      e.preventDefault();
      if (selectedHabits.length === 0) return;
      const selectedHabit = selectedHabits.find(({ order }) => order === selectedIndex);
      if (!selectedHabit) throw new Error('no habit found at selected index');
      const currentCompletedState = occurrenceData.dates[dayObject.dateString][selectedHabit.id];
      updateHabitCompleted(selectedHabit.id, !currentCompletedState);
    },
  };

  if (key === 'ArrowDown' && view !== 'history') shortcuts.incrementSelectedIndex();
  if (key === 'ArrowUp' && view !== 'history') shortcuts.decrementSelectedIndex();

  if (!inInput) {
    if (key === 't' && !inTransition && (displayingYesterday !== false || view !== 'habit')) shortcuts.today();
    if (key === 'y' && !inTransition && (displayingYesterday !== true || view !== 'habit')) shortcuts.yesterday();
    if (key === 's' && !inTransition && view !== 'selection') shortcuts.selection();
    if (key === 'h' && !inTransition && view !== 'history') shortcuts.history();
    if (key === 'f' && !inTransition && view !== 'history') shortcuts.focus();
    if (key === 'Enter') shortcuts.updateHabitCompleted();
    if (key === 'c' && view === 'selection') shortcuts.createHabit();
  }
}
