import { Habit, Occurrence, View } from '../../globalTypes';

export default function getBodyHeight(
  view: View,
  habits: Habit[],
  occurrences: Occurrence[],
) {
  switch (view) {
    case 'habit': return habits.length * 50;
    case 'history': return (occurrences.length / 7 - 1) * 50;
    case 'focus': return (occurrences.length / 7 - 1) * 50;
    case 'selection': return habits.length * 50 + 50;
    default: return 0;
  }
}
