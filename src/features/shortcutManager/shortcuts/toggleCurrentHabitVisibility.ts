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
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function toggleCurrentHabitVisibility(states: States) {
  const {
    dateObject,
    latchedListView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    updateHabitVisibility,
  } = states;

  if (selectedHabits.length === 0 || !occurrenceData) return;

  const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
  if (!selectedHabit) throw new Error('no habit found at selected index');
  // eslint-disable-next-line max-len
  const todaysOccurrences = latchedListView.name === 'yesterday'
    ? occurrenceData.dates[dateObject.yesterday.dateString]
    : occurrenceData.dates[dateObject.today.dateString];
  const currentVisibility = todaysOccurrences[selectedHabit.id] === undefined
    ? false
    : todaysOccurrences[selectedHabit.id].visible;
  updateHabitVisibility(selectedHabit.id, !currentVisibility);
}
