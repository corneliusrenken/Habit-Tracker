import React from 'react';
import { ModalGenerator } from '../../globalTypes';

type Props = {
  habitName: string;
  disableTabIndex: boolean;
  onConfirm: () => void;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
};

export default function HabitRemovalConfirmationModalContent({
  habitName,
  disableTabIndex,
  onConfirm,
  setModal,
}: Props) {
  return (
    <>
      <h1>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        Delete&nbsp;<b>{habitName}</b>?
      </h1>
      <small>
        Doing so will irretrievably remove all related data.
      </small>
      <div className="button-group">
        <button
          tabIndex={disableTabIndex ? -1 : undefined}
          type="button"
          onClick={() => setModal(undefined)}
        >
          Cancel
        </button>
        <button
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
