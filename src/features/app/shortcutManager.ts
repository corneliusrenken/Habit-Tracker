import { Habit, View } from '../../globalTypes';

type States = {
  inInput: boolean;
  selectedIndex: number;
  habits: Habit[];
  view: View;
  displayingYesterday: boolean;
  setView: (v: View) => void;
  setDisplayingYesterday: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: (newIndex: number) => void;
  setFocusId: React.Dispatch<React.SetStateAction<number | undefined>>;
  inTransition: boolean;
};

export default function shortcutManager(e: KeyboardEvent, states: States) {
  const {
    inInput,
    selectedIndex,
    habits,
    view,
    displayingYesterday,
    setView,
    setDisplayingYesterday,
    setSelectedIndex,
    setFocusId,
    inTransition,
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
      e.preventDefault();
      setView('history');
      setDisplayingYesterday(false);
      setFocusId(habits.find(({ order }) => order === selectedIndex)?.id);
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
  };

  if (!inTransition && !inInput && key === 't' && (displayingYesterday !== false || view !== 'habit')) shortcuts.today();
  if (!inTransition && !inInput && key === 'y' && (displayingYesterday !== true || view !== 'habit')) shortcuts.yesterday();
  if (!inTransition && !inInput && key === 's' && view !== 'selection') shortcuts.selection();
  if (!inTransition && !inInput && key === 'h' && view !== 'history') shortcuts.history();
  if (!inTransition && !inInput && key === 'f' && view !== 'history') shortcuts.focus();
  if (key === 'ArrowDown' && view !== 'history') shortcuts.incrementSelectedIndex();
  if (key === 'ArrowUp' && view !== 'history') shortcuts.decrementSelectedIndex();
  if (!inInput && key === 'c' && view === 'selection') shortcuts.createHabit();
}
