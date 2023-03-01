import {
  DateObject, Habit, ListView, OccurrenceData,
} from '../../globalTypes';

type States = {
  habits: Habit[];
  occurrenceData: OccurrenceData;
  dateObject: DateObject;
  listView: ListView;
};

export default function getSelectedHabits({
  habits,
  occurrenceData,
  dateObject,
  listView,
}: States) {
  const selectedDate = listView.name === 'yesterday'
    ? dateObject.yesterday.dateString
    : dateObject.today.dateString;

  const dayOccurrences = occurrenceData.dates[selectedDate] || {};

  return listView.name === 'selection'
    ? habits
    : habits.filter(({ id }) => dayOccurrences[id]?.visible);
}
