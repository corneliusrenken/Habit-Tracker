import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function updateHabitId(oldHabitId: number, newHabitId: number, states: States) {
  if (oldHabitId === newHabitId) return;

  const { setHabits, setStreaks, setOccurrenceData } = states;

  setHabits((previousHabits) => {
    if (!previousHabits) throw new Error('state should not be undefined');

    if (previousHabits.find((habit) => habit.id === oldHabitId) === undefined) {
      throw new Error('no habit exists with the given id');
    }

    if (previousHabits.find((habit) => habit.id === newHabitId) !== undefined) {
      throw new Error('habit id has to be unique');
    }

    return previousHabits.map((habit) => {
      if (habit.id === oldHabitId) {
        return { ...habit, id: newHabitId };
      }
      return habit;
    });
  });

  setOccurrenceData((previousOccurrenceData) => {
    if (!previousOccurrenceData) throw new Error('state should not be undefined');

    const habitIds = Object.keys(previousOccurrenceData.oldest).map(Number);
    const dates = Object.keys(previousOccurrenceData.dates);

    const newOccurrenceData: OccurrenceData = {
      oldest: {},
      dates: {},
    };

    habitIds.forEach((habitId) => {
      if (habitId === oldHabitId) {
        newOccurrenceData.oldest[newHabitId] = previousOccurrenceData.oldest[habitId];
      } else {
        newOccurrenceData.oldest[habitId] = previousOccurrenceData.oldest[habitId];
      }
    });

    dates.forEach((date) => {
      newOccurrenceData.dates[date] = { ...previousOccurrenceData.dates[date] };
      if (newOccurrenceData.dates[date][oldHabitId] !== undefined) {
        newOccurrenceData.dates[date][newHabitId] = newOccurrenceData.dates[date][oldHabitId];
        delete newOccurrenceData.dates[date][oldHabitId];
      }
    });

    return newOccurrenceData;
  });

  setStreaks((previousStreaks) => {
    if (!previousStreaks) throw new Error('state should not be undefined');

    const newStreaks: Streaks = {};

    const habitIds = Object.keys(previousStreaks).map(Number);

    habitIds.forEach((habitId) => {
      if (habitId === oldHabitId) {
        newStreaks[newHabitId] = previousStreaks[habitId];
      } else {
        newStreaks[habitId] = previousStreaks[habitId];
      }
    });

    return newStreaks;
  });
}
