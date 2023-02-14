import React from 'react';
import { Habit } from '../../../globalTypes';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function deleteHabit(
  habitId: number,
  states: States,
) {
  const { setHabits, setSelectedIndex } = states;

  let newHabits: Habit[] = [];

  setHabits((prevHabits) => {
    if (!prevHabits) throw new Error('previous state should not be undefined');

    if (prevHabits.find(({ id }) => id === habitId) === undefined) {
      throw new Error('habit with this id doesn\'t exist');
    }

    newHabits = prevHabits.filter(({ id }) => id !== habitId);
    return newHabits;
  });

  // will always be able to set selected index to non null value in selection view
  setSelectedIndex((previousSelectedIndex) => {
    if (previousSelectedIndex === null) throw new Error('should never call deleteHabit when selected index is null');

    return Math.min(previousSelectedIndex, newHabits.length);
  });
}
