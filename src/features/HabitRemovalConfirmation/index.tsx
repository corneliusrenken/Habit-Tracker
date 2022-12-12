import React, { useEffect } from 'react';
import './habitRemovalConfirmation.css';

type Props = {
  habitName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function HabitRemovalConfirmation({
  habitName,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    // https://github.com/Microsoft/TypeScript/issues/5901#issuecomment-431649653
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, []);

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
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="button" onClick={onConfirm}>Delete habit</button>
      </div>
    </div>
  );
}
