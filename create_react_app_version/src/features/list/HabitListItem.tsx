/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

type Props = {
  name: string;
  streak: number;
  completed: boolean;
  selected: boolean;
  select: () => void;
  toggleCompleted: () => void;
};

export default function HabitListItem({
  name, streak, completed, selected, select, toggleCompleted,
}: Props) {
  let containerClassName = 'list-item';
  if (completed) containerClassName += ' greyed-out';
  if (selected) containerClassName += ' list-item-selected';

  return (
    <div className={containerClassName} onClick={toggleCompleted} onMouseEnter={select}>
      <div className="name">{name}</div>
      <div className="streak">{streak}</div>
    </div>
  );
}
