import React from 'react';

type Props = {
  ignoreMouse: boolean;
  name: string;
  streak: number;
  completed: boolean;
  selected: boolean;
  select: () => void;
  toggleCompleted: () => void;
  style?: React.CSSProperties;
};

export default function HabitListItem({
  ignoreMouse,
  name,
  streak,
  completed,
  selected,
  select,
  toggleCompleted,
  style,
}: Props) {
  let containerClassName = 'list-item';
  if (completed) containerClassName += ' complete';
  if (selected) containerClassName += ' selected';

  return (
    <button
      type="button"
      tabIndex={-1}
      className={containerClassName}
      onClick={toggleCompleted}
      onMouseEnter={ignoreMouse ? undefined : select}
      style={style}
    >
      <div className="name">{name}</div>
      <div className="streak">{streak}</div>
    </button>
  );
}

HabitListItem.defaultProps = {
  style: {},
};
