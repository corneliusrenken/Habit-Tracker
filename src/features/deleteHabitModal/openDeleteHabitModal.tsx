import React from 'react';
import { Habit, ModalGenerator } from '../../globalTypes';
import HabitRemovalConfirmationModalContent from '.';

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function openDeleteHabitModal(
  habit: Habit,
  states: States,
) {
  const {
    setModal, deleteHabit,
  } = states;
  // eslint-disable-next-line arrow-body-style
  const modalContentGenerator = (disableTabIndex: boolean) => {
    return (
      <HabitRemovalConfirmationModalContent
        habitName={habit.name}
        disableTabIndex={disableTabIndex}
        setModal={setModal}
        onConfirm={() => {
          setModal(undefined);
          deleteHabit(habit.id);
        }}
      />
    );
  };

  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // (passing a function into a state setter auto-populates passes the inital state as first arg)
  setModal(() => modalContentGenerator);
}
