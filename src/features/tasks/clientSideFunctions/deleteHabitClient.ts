import React from 'react';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';

type States = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function deleteHabitClient(
  habitId: number,
  states: States,
) {
  const {
    habits,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setSelectedIndex,
    setInInput,
  } = states;

  setHabits((previousHabits) => {
    if (previousHabits.find(({ id }) => id === habitId) === undefined) {
      throw new Error('habit with this id doesn\'t exist');
    }

    let newHabits: Habit[] = JSON.parse(JSON.stringify(previousHabits));

    newHabits = newHabits.filter(({ id }) => id !== habitId);

    return newHabits;
  });

  setOccurrenceData((previousOccurrenceData) => {
    const dates = Object.keys(previousOccurrenceData.dates);

    const newOccurrenceData: OccurrenceData = JSON.parse(JSON.stringify(previousOccurrenceData));

    delete newOccurrenceData.oldest[habitId];

    dates.forEach((date) => {
      delete newOccurrenceData.dates[date][habitId];
    });

    return newOccurrenceData;
  });

  setStreaks((previousStreaks) => {
    const newStreaks: Streaks = JSON.parse(JSON.stringify(previousStreaks));

    delete newStreaks[habitId];

    return newStreaks;
  });

  setSelectedIndex((previousSelectedIndex) => {
    if (previousSelectedIndex === null) throw new Error('should never call deleteHabit when selected index is null');

    const newHabitCount = habits.length - 1;
    const newIndex = Math.max(0, Math.min(previousSelectedIndex, newHabitCount - 1));

    if (newIndex === 0 && newHabitCount === 0) {
      setInInput(true);
    }

    return newIndex;
  });
}
