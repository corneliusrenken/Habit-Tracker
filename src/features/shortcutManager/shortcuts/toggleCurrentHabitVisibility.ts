import { DayObject, Habit, OccurrenceData } from '../../../globalTypes';

type States = {
  dayObject: DayObject;
  occurrenceData: OccurrenceData | undefined;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function toggleCurrentHabitVisibility(states: States) {
  const {
    dayObject,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    updateHabitVisibility,
  } = states;

  if (selectedHabits.length === 0 || !occurrenceData) return;

  const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
  if (!selectedHabit) throw new Error('no habit found at selected index');
  // eslint-disable-next-line max-len
  const currentVisibility = occurrenceData.dates[dayObject.dateString][selectedHabit.id] === undefined
    ? false
    : occurrenceData.dates[dayObject.dateString][selectedHabit.id].visible;
  updateHabitVisibility(selectedHabit.id, !currentVisibility);
}
