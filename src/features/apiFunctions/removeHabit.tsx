/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import axios from 'axios';
import { Habit, ModalContentGenerator } from '../../globalTypes';
import HabitRemovalConfirmation from '../HabitRemovalConfirmation';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
};

export default function removeHabit(
  habitId: number,
  states: States,
) {
  const {
    habits, setHabits, selectedIndex, setSelectedIndex, setModalContentGenerator,
  } = states;

  if (selectedIndex === null) return;

  if (!habits) throw new Error('states should not be undefined');

  const habitToRemove = habits.find(({ id }) => id === habitId);

  if (!habitToRemove) throw new Error('no habit at given id');

  // eslint-disable-next-line arrow-body-style
  const modalContentGenerator = (allowTabTraversal: boolean) => {
    return (
      <HabitRemovalConfirmation
        habitName={habitToRemove.name}
        allowTabTraversal={allowTabTraversal}
        setModalContentGenerator={setModalContentGenerator}
        onConfirm={() => {
          axios({
            method: 'delete',
            url: `/api/habits/${habitId}`,
          });

          const newHabits: Habit[] = habits.filter(({ id }) => id !== habitId);

          setModalContentGenerator(undefined);
          setHabits(newHabits);
          // will always be able to set selected index to non null value in seleciton view
          setSelectedIndex(Math.max(selectedIndex - 1, 0));
        }}
      />
    );
  };

  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // (passing a function into a state setter auto-populates passes the inital state as first arg)
  setModalContentGenerator(() => modalContentGenerator);
}
