/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

type Props = {
  name: string;
  streak: number;
  completed: boolean;
  toggleCompleted: () => void;
  selected: boolean;
};

export default function HabitListItem({
  name, streak, completed, toggleCompleted, selected,
}: Props) {
  let containerClassName = 'list-item';
  if (completed) containerClassName += ' greyed-out';
  if (selected) containerClassName += ' list-item-selected';

  return (
    <div className={containerClassName} onClick={toggleCompleted}>
      <div className="name">{name}</div>
      <div className="streak">{streak}</div>
    </div>
  );
}
