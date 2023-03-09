import React from 'react';
import { Habit, ModalGenerator } from '../../globalTypes';

type Props = {
  habitName: string;
  disableTabIndex: boolean;
  onConfirm: () => void;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
};

function DeleteHabitModal({
  habitName,
  disableTabIndex,
  onConfirm,
  setModal,
}: Props) {
  return (
    <>
      <div className="modal-header">
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        Delete&nbsp;<b>{habitName}</b>?
      </div>
      <div className="modal-subtext">
        Doing so will irretrievably remove all related data.
      </div>
      <div className="button-group">
        <button
          className="dialog-button"
          tabIndex={disableTabIndex ? -1 : undefined}
          type="button"
          onClick={() => setModal(undefined)}
        >
          Cancel
        </button>
        <button
          className="dialog-button"
          tabIndex={disableTabIndex ? -1 : undefined}
          type="button"
          onClick={() => onConfirm()}
        >
          Delete Habit
        </button>
      </div>
    </>
  );
}

type States = {
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function createDeleteHabitModalGenerator(
  habit: Habit,
  {
    setModal,
    deleteHabit,
  }: States,
): ModalGenerator {
  return function deleteHabitModalGenerator(disableTabIndex: boolean) {
    return (
      <DeleteHabitModal
        disableTabIndex={disableTabIndex}
        habitName={habit.name}
        setModal={setModal}
        onConfirm={() => {
          setModal(undefined);
          deleteHabit(habit.id);
        }}
      />
    );
  };
}
