import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { Task } from '../../taskQueue';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function updateHabitStateUpdate(
  habitId: number,
  updateData: { id: number } | Task<'update-habit'>['args']['updateData'],
  states: States,
) {
  const {
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
  } = states;
  setHabits((previousHabits) => {
    if (previousHabits.find((habit) => habit.id === habitId) === undefined) {
      throw new Error('no habit exists with the given id');
    }

    const newHabits: Habit[] = JSON.parse(JSON.stringify(previousHabits));

    if ('name' in updateData) {
      return newHabits.map((habit) => (habit.id === habitId
        ? { ...habit, name: updateData.name }
        : habit));
    }

    if ('listPosition' in updateData) {
      if (updateData.listPosition < 0 || updateData.listPosition >= previousHabits.length) {
        throw new Error('new list position is out of bounds');
      }

      const toUpdateIndex = newHabits.findIndex((habit) => habit.id === habitId);
      const toUpdateHabit = newHabits.splice(toUpdateIndex, 1)[0];
      newHabits.splice(updateData.listPosition, 0, toUpdateHabit);
      return newHabits;
    }

    if ('id' in updateData) {
      if (
        habitId !== updateData.id
        && previousHabits.find((habit) => habit.id === updateData.id) !== undefined
      ) {
        throw new Error('habit id has to be unique');
      }

      return newHabits.map((habit) => (habit.id === habitId
        ? { ...habit, id: updateData.id }
        : habit));
    }

    throw new Error('updateData is not valid');
  });

  if ('listPosition' in updateData) {
    setSelectedIndex(updateData.listPosition);
  }

  if ('id' in updateData) {
    setOccurrenceData((previousOccurrenceData) => {
      const habitIds = Object.keys(previousOccurrenceData.oldest).map(Number);
      const dates = Object.keys(previousOccurrenceData.dates);

      const newOccurrenceData: OccurrenceData = {
        oldest: {},
        dates: {},
      };

      habitIds.forEach((id) => {
        if (id === habitId) {
          newOccurrenceData.oldest[updateData.id] = previousOccurrenceData.oldest[id];
        } else {
          newOccurrenceData.oldest[id] = previousOccurrenceData.oldest[id];
        }
      });

      dates.forEach((date) => {
        newOccurrenceData.dates[date] = { ...previousOccurrenceData.dates[date] };
        if (newOccurrenceData.dates[date][habitId] !== undefined) {
          newOccurrenceData.dates[date][updateData.id] = newOccurrenceData.dates[date][habitId];
          delete newOccurrenceData.dates[date][habitId];
        }
      });

      return newOccurrenceData;
    });

    setStreaks((previousStreaks) => {
      const newStreaks: Streaks = {};

      const habitIds = Object.keys(previousStreaks).map(Number);

      habitIds.forEach((id) => {
        if (id === habitId) {
          newStreaks[updateData.id] = previousStreaks[id];
        } else {
          newStreaks[id] = previousStreaks[id];
        }
      });

      return newStreaks;
    });
  }
}
