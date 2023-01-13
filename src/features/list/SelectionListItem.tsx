import React, { useState } from 'react';
import { Habit } from '../../globalTypes';
import Icon from '../icon';
import isValidHabitName from './isValidHabitName';

type Props = {
  allowTabTraversal: boolean;
  name: string;
  visible: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
  selected: boolean;
  select: undefined | (() => void);
  toggleVisibility: () => void;
  removeHabit: () => void;
  renameHabit: (newName: string) => void;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  habits: Habit[];
};

export default function SelectionListItem({
  allowTabTraversal,
  name,
  visible,
  move,
  selected,
  select,
  toggleVisibility,
  removeHabit,
  renameHabit,
  inInput,
  setInInput,
  habits,
}: Props) {
  const [renameInput, setRenameInput] = useState('');
  const [isRenameButtonDisabled, setIsRenameButtonDisabled] = useState(false);

  const beingRenamed = selected && inInput;

  let containerClassName = 'list-item';
  if (selected) containerClassName += ' list-item-selected';

  return (
    <div className={containerClassName} onMouseEnter={select}>
      {!beingRenamed ? (
        <div className="name">{name}</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmedRenameInput = renameInput.trim();

            if (trimmedRenameInput === name) {
              setInInput(false);
              return;
            }

            const validation = isValidHabitName(trimmedRenameInput, { habits });
            if (validation === true) {
              renameHabit(trimmedRenameInput);
              setInInput(false);
            } else {
              console.error(validation); // eslint-disable-line no-console
            }
          }}
        >
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
          allowTabTraversal={allowTabTraversal}
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
        <Icon
          icon="trash"
          allowTabTraversal={allowTabTraversal}
          onClick={removeHabit}
          hidden={!selected}
        />
        <Icon
          icon="move"
          classes={['move-icon']}
          allowTabTraversal={allowTabTraversal}
          onMouseDown={move}
          hidden={!selected}
        />
        <Icon
          icon={visible ? 'visible' : 'hidden'}
          allowTabTraversal={allowTabTraversal}
          classes={!visible ? ['greyed-out'] : undefined}
          onClick={toggleVisibility}
        />
      </div>
    </div>
  );
}
