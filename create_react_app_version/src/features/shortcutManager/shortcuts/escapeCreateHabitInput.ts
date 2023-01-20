import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function escapeCreateHabitInput(states: States) {
  const {
    habits,
    setSelectedIndex,
    setInInput,
  } = states;

  if (!habits) return;
  setInInput(false);
  if (habits.length === 0) {
    setSelectedIndex(null);
  } else {
    setSelectedIndex(habits.length - 1);
  }
}
