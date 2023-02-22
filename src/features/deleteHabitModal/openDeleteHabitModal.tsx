import React from 'react';
import { Habit, ModalContentGenerator } from '../../globalTypes';
import HabitRemovalConfirmationModalContent from '.';

type States = {
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function openDeleteHabitModal(
  habit: Habit,
  states: States,
) {
  const {
    setModalContentGenerator, deleteHabit,
  } = states;
  // eslint-disable-next-line arrow-body-style
  const modalContentGenerator = (allowTabTraversal: boolean) => {
    return (
      <HabitRemovalConfirmationModalContent
        habitName={habit.name}
        allowTabTraversal={allowTabTraversal}
        setModalContentGenerator={setModalContentGenerator}
        onConfirm={() => {
          setModalContentGenerator(undefined);
          deleteHabit(habit.id);
        }}
      />
    );
  };

  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // (passing a function into a state setter auto-populates passes the inital state as first arg)
  setModalContentGenerator(() => modalContentGenerator);
}
