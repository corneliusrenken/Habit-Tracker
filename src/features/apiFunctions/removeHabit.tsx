import React from 'react';
import axios from 'axios';
import { Habit } from '../../globalTypes';
import HabitRemovalConfirmation from '../HabitRemovalConfirmation';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setModalContent: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>;
};

export default function removeHabit(
  habitId: number,
  states: States,
) {
  const {
    habits, setHabits, selectedIndex, setSelectedIndex, setModalContent,
  } = states;

  if (selectedIndex === null) return;

  if (!habits) throw new Error('states should not be undefined');

  const habitToRemove = habits.find(({ id }) => id === habitId);

  if (!habitToRemove) throw new Error('no habit at given id');

  setModalContent((
    <HabitRemovalConfirmation
      habitName={habitToRemove.name}
      onCancel={() => setModalContent(undefined)}
      onConfirm={() => {
        axios({
          method: 'delete',
          url: `/api/habits/${habitId}`,
        });

        const newHabits: Habit[] = habits.filter(({ id }) => id !== habitId);

        setModalContent(undefined);
        setHabits(newHabits);
        // will always be able to set selected index to non null value in seleciton view
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      }}
    />
  ));
}
