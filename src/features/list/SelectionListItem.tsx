import React from 'react';
import Icon from '../icon';

type Props = {
  name: string;
  visible: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
  selected: boolean;
  toggleVisibility: () => void;
  removeHabit: () => void;
};

export default function SelectionListItem({
  name, visible, move, selected, toggleVisibility, removeHabit,
}: Props) {
  let containerClassName = 'list-item';
  if (selected) containerClassName += ' list-item-selected';

  return (
    <div className={containerClassName}>
      <div className="name">{name}</div>
      <div className="horizontal-icon-list">
        <Icon icon="rename" hidden={!selected} />
        <Icon
          icon={visible ? 'visible' : 'hidden'}
          classes={!visible ? ['greyed-out'] : undefined}
          onClick={toggleVisibility}
          hidden={!selected}
        />
        <Icon icon="trash" onClick={removeHabit} hidden={!selected} />
        <Icon icon="move" onMouseDown={move} hidden={!selected} />
      </div>
    </div>
  );
}
