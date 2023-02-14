import {
  DateObject, Habit, ListView, OccurrenceData,
} from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  occurrenceData: OccurrenceData | undefined;
  dateObject: DateObject;
  latchedListView: ListView;
};

export default function getSelectedHabits(states: States) {
  const {
    habits,
    occurrenceData,
    dateObject,
    latchedListView,
  } = states;

  if (!habits || !occurrenceData) return [];

  const selectedDate = latchedListView.name === 'yesterday'
    ? dateObject.yesterday.dateString
    : dateObject.today.dateString;

  const dayOccurrences = occurrenceData.dates[selectedDate] || {};

  return latchedListView.name === 'selection'
    ? habits
    : habits.filter(({ id }) => dayOccurrences[id]?.visible);
}
