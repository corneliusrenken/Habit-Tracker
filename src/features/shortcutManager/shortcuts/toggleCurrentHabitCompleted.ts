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
  occurrenceData: OccurrenceData | undefined;
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

  if (!occurrenceData || selectedHabits.length === 0) return;

  const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
  if (!selectedHabit) throw new Error('no habit found at selected index');
  // eslint-disable-next-line max-len
  const todaysOccurrences = latchedListView.name === 'yesterday'
    ? occurrenceData.dates[dateObject.yesterday.dateString]
    : occurrenceData.dates[dateObject.today.dateString];
  // if the selected habit is visible (checked above) it must be present in today's occurrences
  const currentCompletedState = todaysOccurrences[selectedHabit.id].complete;
  updateOccurrenceCompleted(selectedHabit.id, !currentCompletedState);
}
