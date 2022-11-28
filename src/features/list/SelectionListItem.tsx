import React from 'react';
import Icon from '../icon';

type Props = {
  name: string;
  selected: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
};

export default function SelectionListItem({ name, selected, move }: Props) {
  let nameClassName = 'name';
  if (!selected) nameClassName += ' greyed-out';

  return (
    <div className="list-item">
      <div className={nameClassName}>{name}</div>
      <Icon icon="move" onMouseDown={move} />
    </div>
  );
}
