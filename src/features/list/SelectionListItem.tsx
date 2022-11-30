import React from 'react';
import Icon from '../icon';

type Props = {
  name: string;
  visible: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
  selected: boolean;
};

export default function SelectionListItem({
  name, visible, move, selected,
}: Props) {
  let nameClassName = 'name';
  if (!visible) nameClassName += ' greyed-out';

  return (
    <div className="list-item">
      <div className={nameClassName} style={selected ? { color: 'red' } : undefined}>{name}</div>
      <Icon icon="move" onMouseDown={move} />
    </div>
  );
}
