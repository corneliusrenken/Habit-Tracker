import React from 'react';

type Props = {
  name: string;
  streak: number;
  completed: boolean;
};

export default function HabitListItem({ name, streak, completed }: Props) {
  let containerClassName = 'list-item';
  if (!completed) containerClassName += ' greyed-out';

  return (
    <div className={containerClassName}>
      <div className="name">{name}</div>
      <div className="streak">{streak}</div>
    </div>
  );
}
