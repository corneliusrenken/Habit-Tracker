import React from 'react';
import { ModalContentGenerator } from '../../globalTypes';

type Props = {
  habitName: string;
  allowTabTraversal: boolean;
  onConfirm: () => void;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
};

export default function HabitRemovalConfirmationModalContent({
  habitName,
  allowTabTraversal,
  onConfirm,
  setModalContentGenerator,
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
          tabIndex={allowTabTraversal ? undefined : -1}
          type="button"
          onClick={() => setModalContentGenerator(undefined)}
        >
          Cancel
        </button>
        <button
          tabIndex={allowTabTraversal ? undefined : -1}
          type="button"
          onClick={() => onConfirm()}
        >
          Delete habit
        </button>
      </div>
    </div>
  );
}
