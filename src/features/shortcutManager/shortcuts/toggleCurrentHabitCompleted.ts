import {
  DateObject,
  Habit,
  View,
  OccurrenceData,
} from '../../../globalTypes';

type States = {
  dateObject: DateObject;
  view: View;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  occurrenceData: OccurrenceData;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
};

export default function toggleCurrentHabitCompleted({
  dateObject,
  view,
  selectedHabits,
  selectedIndex,
  occurrenceData,
  updateOccurrenceCompleted,
}: States) {
  if (selectedIndex === null) return;

  const selectedHabit = selectedHabits[selectedIndex];
  const todaysOccurrences = view.name === 'yesterday'
    ? occurrenceData.dates[dateObject.yesterday.dateString]
    : occurrenceData.dates[dateObject.today.dateString];
  const currentCompletedState = todaysOccurrences[selectedHabit.id].complete;
  updateOccurrenceCompleted(selectedHabit.id, !currentCompletedState);
}
