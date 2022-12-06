import React, { useState } from 'react';
import Icon from '../icon';

type Props = {
  name: string;
  visible: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
  selected: boolean;
  toggleVisibility: () => void;
  removeHabit: () => void;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SelectionListItem({
  name, visible, move, selected, toggleVisibility, removeHabit, inInput, setInInput,
}: Props) {
  const [renameInput, setRenameInput] = useState('');
  const [isRenameButtonDisabled, setIsRenameButtonDisabled] = useState(false);

  const beingRenamed = selected && inInput;

  let containerClassName = 'list-item';
  if (selected) containerClassName += ' list-item-selected';

  return (
    <div className={containerClassName}>
      {!beingRenamed ? (
        <div className="name">{name}</div>
      ) : (
        <form>
          <input
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            onFocus={() => {
              setRenameInput(name);
              setIsRenameButtonDisabled(true);
            }}
            onBlur={() => {
              setInInput(false);
              const onMouseUp = () => {
                setTimeout(() => setIsRenameButtonDisabled(false), 0);
                window.removeEventListener('mouseup', onMouseUp);
              };
              window.addEventListener('mouseup', onMouseUp);
            }}
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
          />
        </form>
      )}
      <div className="horizontal-icon-list">
        <Icon
          icon="rename"
          classes={beingRenamed ? ['greyed-out'] : undefined}
          hidden={!selected}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={() => {
            if (!isRenameButtonDisabled) {
              setInInput(true);
            }
          }}
        />
        <Icon icon="trash" onClick={removeHabit} hidden={!selected} />
        <Icon icon="move" onMouseDown={move} hidden={!selected} />
        <Icon
          icon={visible ? 'visible' : 'hidden'}
          classes={!visible ? ['greyed-out'] : undefined}
          onClick={toggleVisibility}
        />
      </div>
    </div>
  );
}
