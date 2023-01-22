import { DayObject, Habit, OccurrenceData } from '../../../globalTypes';

type States = {
  dayObject: DayObject;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  occurrenceData: OccurrenceData | undefined;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
};

export default function toggleCurrentHabitCompleted(states: States) {
  const {
    dayObject,
    selectedHabits,
    selectedIndex,
    occurrenceData,
    updateHabitCompleted,
  } = states;

  if (!occurrenceData || selectedHabits.length === 0) return;

  const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
  if (!selectedHabit) throw new Error('no habit found at selected index');
  const currentCompletedState = occurrenceData.dates[dayObject.dateString][selectedHabit.id];
  updateHabitCompleted(selectedHabit.id, !currentCompletedState);
}
