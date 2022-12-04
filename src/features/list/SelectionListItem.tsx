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

  let containerClassName = 'list-item';
  if (selected) containerClassName += ' list-item-selected';

  return (
    <div className={containerClassName}>
      <div className={nameClassName}>{name}</div>
      <Icon icon="move" onMouseDown={move} hidden={!selected} />
    </div>
  );
}
