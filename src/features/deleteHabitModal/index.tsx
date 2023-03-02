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
    <div className="habit-removal-confirmation-container">
      <div>
        Delete&nbsp;
        <b>{habitName}</b>
        ?
      </div>
      <div
        className="sub-text"
      >
        Doing so will irretrievably remove all related data.
      </div>
      <div className="habit-removal-confirmation-button-container">
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
          Delete habit
        </button>
      </div>
    </div>
  );
}
