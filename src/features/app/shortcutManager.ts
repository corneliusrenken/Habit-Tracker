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
    view,
    displayingYesterday,
    setView,
    setDisplayingYesterday,
    selectedIndex,
    setSelectedIndex,
    setFocusId,
    inTransition,
  } = states;
  const { key } = e;

  if (inInput || inTransition) return;

  const shortcuts = {
    today: () => {
      e.preventDefault();
      setView('habit');
      setDisplayingYesterday(false);
      setSelectedIndex(0);
    },
    yesterday: () => {
      e.preventDefault();
      setView('habit');
      setDisplayingYesterday(true);
      setSelectedIndex(0);
    },
    selection: () => {
      e.preventDefault();
      setView('selection');
      setDisplayingYesterday(false);
      setSelectedIndex(0);
    },
    history: () => {
      e.preventDefault();
      setView('history');
      setFocusId(undefined);
    },
    // focus: () => {
    //   e.preventDefault();
    //   setView('focus');
    //   setFocusId(selectedHabit.id);
    // },
    incrementSelectedIndex: () => {
      e.preventDefault();
      setSelectedIndex(selectedIndex + 1);
    },
    decrementSelectedIndex: () => {
      e.preventDefault();
      setSelectedIndex(selectedIndex - 1);
    },
  };

  if (key === 't' && (displayingYesterday !== false || view !== 'habit')) shortcuts.today();
  if (key === 'y' && (displayingYesterday !== true || view !== 'habit')) shortcuts.yesterday();
  if (key === 's' && view !== 'selection') shortcuts.selection();
  if (key === 'h' && view !== 'history') shortcuts.history();
  // if (key === 'f' && view !== 'history') shortcuts.focus();
  if (key === 'ArrowDown') shortcuts.incrementSelectedIndex();
  if (key === 'ArrowUp') shortcuts.decrementSelectedIndex();
}
