import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  selectedIndex: number | null;
  updateHabitListPosition(habitId: number, listPosition: number): void;
};

export default function reorderHabit(direction: 1 | -1, states: States) {
  const { habits, selectedIndex, updateHabitListPosition } = states;

  if (!habits) return;

  if (selectedIndex === null || habits[selectedIndex] === undefined) return;

  const habit = habits[selectedIndex];

  const oldPosition = selectedIndex;
  const newPosition = Math.max(0, Math.min(habits.length - 1, selectedIndex + direction));

  if (oldPosition !== newPosition) updateHabitListPosition(habit.id, newPosition);
}
