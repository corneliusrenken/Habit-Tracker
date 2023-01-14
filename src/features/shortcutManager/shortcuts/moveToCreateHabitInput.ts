import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function moveToCreateHabitInput(states: States) {
  const {
    habits,
    setSelectedIndex,
  } = states;

  if (!habits) return;

  setSelectedIndex(habits.length);
}
