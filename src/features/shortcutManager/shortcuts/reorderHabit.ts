import { Habit } from '../../../globalTypes';
import scrollSelectedIndexIntoView from '../helpers/scrollSelectedIndexIntoView';

type States = {
  selectedHabits: Habit[];
  selectedIndex: number | null;
  updateHabitListPosition(habitId: number, listPosition: number): void;
};

export default function reorderHabit(
  direction: 1 | -1,
  {
    selectedHabits,
    selectedIndex,
    updateHabitListPosition,
  }: States,
) {
  if (selectedIndex === null || selectedIndex === selectedHabits.length) return;

  const habit = selectedHabits[selectedIndex];

  const oldPosition = selectedIndex;
  const newPosition = Math.max(0, Math.min(selectedHabits.length - 1, selectedIndex + direction));

  if (oldPosition !== newPosition) updateHabitListPosition(habit.id, newPosition);
  scrollSelectedIndexIntoView(newPosition, { behavior: 'instant' });
}
