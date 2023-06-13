import {
  DateObject,
  Habit,
  View,
  OccurrenceData,
} from '../../../globalTypes';
import scrollSelectedIndexIntoView from '../helpers/scrollSelectedIndexIntoView';

type States = {
  dateObject: DateObject;
  view: View;
  occurrenceData: OccurrenceData;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function toggleCurrentHabitVisibility({
  dateObject,
  view,
  occurrenceData,
  selectedHabits,
  selectedIndex,
  updateOccurrenceVisibility,
}: States) {
  if (selectedIndex === null || selectedIndex === selectedHabits.length) return;

  const selectedHabit = selectedHabits[selectedIndex];
  const todaysOccurrences = view.name === 'yesterday'
    ? occurrenceData.dates[dateObject.yesterday.dateString]
    : occurrenceData.dates[dateObject.today.dateString];
  const currentVisibility = todaysOccurrences[selectedHabit.id] === undefined
    ? false
    : todaysOccurrences[selectedHabit.id].visible;
  updateOccurrenceVisibility(selectedHabit.id, !currentVisibility);
  scrollSelectedIndexIntoView(selectedIndex, { behavior: 'instant' });
}
