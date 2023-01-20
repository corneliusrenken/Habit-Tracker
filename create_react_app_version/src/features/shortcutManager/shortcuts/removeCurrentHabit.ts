import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  selectedIndex: number | null;
  removeHabit: (habitId: number) => void;
};

export default function removeCurrentHabit(states: States) {
  const {
    habits,
    selectedIndex,
    removeHabit,
  } = states;

  if (!habits || selectedIndex === habits.length) return;
  const selectedHabit = habits.find((habit, index) => index === selectedIndex);
  if (!selectedHabit) throw new Error('no habit found at selected index');
  removeHabit(selectedHabit.id);
}
