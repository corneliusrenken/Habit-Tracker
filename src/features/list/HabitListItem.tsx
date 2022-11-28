import React from 'react';

type Props = {
  name: string;
  streak: number;
  done: boolean;
};

export default function HabitListItem({ name, streak, done }: Props) {
  let containerClassName = 'list-item';
  if (done) containerClassName += ' greyed-out';

  return (
    <div className={containerClassName}>
      <div className="name">{name}</div>
      <div className="streak">{streak}</div>
    </div>
  );
}
