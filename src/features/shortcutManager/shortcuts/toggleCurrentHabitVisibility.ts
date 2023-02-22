import {
  DateObject,
  Habit,
  ListView,
  OccurrenceData,
} from '../../../globalTypes';

type States = {
  dateObject: DateObject;
  latchedListView: ListView;
  occurrenceData: OccurrenceData | undefined;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function toggleCurrentHabitVisibility(states: States) {
  const {
    dateObject,
    latchedListView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    updateOccurrenceVisibility,
  } = states;

  if (!occurrenceData || selectedIndex === null || selectedIndex === selectedHabits.length) return;

  const selectedHabit = selectedHabits[selectedIndex];
  const todaysOccurrences = latchedListView.name === 'yesterday'
    ? occurrenceData.dates[dateObject.yesterday.dateString]
    : occurrenceData.dates[dateObject.today.dateString];
  const currentVisibility = todaysOccurrences[selectedHabit.id] === undefined
    ? false
    : todaysOccurrences[selectedHabit.id].visible;
  updateOccurrenceVisibility(selectedHabit.id, !currentVisibility);
}
