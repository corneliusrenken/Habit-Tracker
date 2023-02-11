import React from 'react';
import { Habit, ModalContentGenerator } from '../../globalTypes';
import HabitRemovalConfirmationModalContent from '.';

type States = {
  habits: Habit[] | undefined;
  selectedIndex: number | null;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function openDeleteHabitModal(
  habitId: number,
  states: States,
) {
  const {
    habits, selectedIndex, setModalContentGenerator, deleteHabit,
  } = states;

  if (selectedIndex === null) return;

  if (!habits) throw new Error('states should not be undefined');

  const habitToRemove = habits.find(({ id }) => id === habitId);

  if (!habitToRemove) throw new Error('no habit at given id');

  // eslint-disable-next-line arrow-body-style
  const modalContentGenerator = (allowTabTraversal: boolean) => {
    return (
      <HabitRemovalConfirmationModalContent
        habitName={habitToRemove.name}
        allowTabTraversal={allowTabTraversal}
        setModalContentGenerator={setModalContentGenerator}
        onConfirm={() => {
          setModalContentGenerator(undefined);
          deleteHabit(habitToRemove.id);
        }}
      />
    );
  };

  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // (passing a function into a state setter auto-populates passes the inital state as first arg)
  setModalContentGenerator(() => modalContentGenerator);
}
