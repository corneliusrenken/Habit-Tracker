import {
  DateObject,
  Habit,
  ListView,
  OccurrenceData,
} from '../../../globalTypes';

type States = {
  dateObject: DateObject;
  latchedListView: ListView;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  occurrenceData: OccurrenceData;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
};

export default function toggleCurrentHabitCompleted(states: States) {
  const {
    dateObject,
    latchedListView,
    selectedHabits,
    selectedIndex,
    occurrenceData,
    updateOccurrenceCompleted,
  } = states;

  if (selectedIndex === null) return;

  const selectedHabit = selectedHabits[selectedIndex];
  const todaysOccurrences = latchedListView.name === 'yesterday'
    ? occurrenceData.dates[dateObject.yesterday.dateString]
    : occurrenceData.dates[dateObject.today.dateString];
  const currentCompletedState = todaysOccurrences[selectedHabit.id].complete;
  updateOccurrenceCompleted(selectedHabit.id, !currentCompletedState);
}
