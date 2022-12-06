import {
  DayObject, Habit, ListView, OccurrenceData,
} from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  occurrenceData: OccurrenceData | undefined;
  dayObject: DayObject;
  listView: ListView;
};

export default function getSelectedHabits(states: States) {
  const {
    habits, occurrenceData, dayObject, listView,
  } = states;

  if (!habits || !occurrenceData) return [];

  const dayOccurrences = occurrenceData.dates[dayObject.dateString] || {};

  return listView === 'habit'
    ? habits.filter(({ id }) => dayOccurrences[id] !== undefined)
    : habits;
}
