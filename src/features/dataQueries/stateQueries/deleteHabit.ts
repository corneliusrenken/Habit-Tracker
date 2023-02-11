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
    newHabits = prevHabits.filter(({ id }) => id !== habitId);
    return newHabits;
  });

  // will always be able to set selected index to non null value in selection view
  setSelectedIndex((previousSelectedIndex) => Math.min(previousSelectedIndex, newHabits.length));
}
