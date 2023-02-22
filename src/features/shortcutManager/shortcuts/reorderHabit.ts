import { Habit } from '../../../globalTypes';

type States = {
  selectedHabits: Habit[];
  selectedIndex: number | null;
  updateHabitListPosition(habitId: number, listPosition: number): void;
};

export default function reorderHabit(direction: 1 | -1, states: States) {
  const { selectedHabits, selectedIndex, updateHabitListPosition } = states;

  if (selectedIndex === null || selectedIndex === selectedHabits.length) return;

  const habit = selectedHabits[selectedIndex];

  const oldPosition = selectedIndex;
  const newPosition = Math.max(0, Math.min(selectedHabits.length - 1, selectedIndex + direction));

  if (oldPosition !== newPosition) updateHabitListPosition(habit.id, newPosition);
}
