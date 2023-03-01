import React, { useEffect, useRef, useState } from 'react';
import { Habit } from '../../globalTypes';
import Icon from '../icon';
import isValidHabitName from './isValidHabitName';

type Props = {
  ignoreMouse: boolean;
  disableTabIndex: boolean;
  name: string;
  visible: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
  selected: boolean;
  select: undefined | (() => void);
  toggleVisibility: () => void;
  openDeleteHabitModal: () => void;
  renameHabit: (newName: string) => void;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  habits: Habit[];
};

export default function SelectionListItem({
  ignoreMouse,
  disableTabIndex,
  name,
  visible,
  move,
  selected,
  select,
  toggleVisibility,
  openDeleteHabitModal,
  renameHabit,
  inInput,
  setInInput,
  habits,
}: Props) {
  const [renameInput, setRenameInput] = useState(name);

  const beingRenamed = selected && inInput;

  useEffect(() => {
    if (!beingRenamed) setRenameInput(name);
  }, [beingRenamed, name]);

  const ignoreNextMouseUp = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);

  let containerClassName = 'list-item';
  if (selected) containerClassName += ' selected';

  return (
    <div className={containerClassName} onMouseEnter={ignoreMouse ? undefined : select}>
      {!beingRenamed ? (
        <div className="list-name">{name}</div>
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
            ref={inputRef}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            onBlur={(e) => {
              e.preventDefault();
              setInInput(false);
            }}
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
          />
        </form>
      )}
      <div className="list-horizontal-icon-container">
        <Icon
          icon="rename"
          disableTabIndex={disableTabIndex}
          onMouseDown={() => {
            const onMouseUp = () => {
              setTimeout(() => { ignoreNextMouseUp.current = false; }, 0);
              window.removeEventListener('mouseup', onMouseUp);
            };

            if (beingRenamed) {
              ignoreNextMouseUp.current = true;
              window.addEventListener('mouseup', onMouseUp);
            }
          }}
          onClick={() => {
            if (!inInput && !ignoreNextMouseUp.current) setInInput(true);
          }}
          classes={beingRenamed ? ['greyed-out'] : undefined}
          hidden={!selected}
        />
        <Icon
          icon="trash"
          disableTabIndex={disableTabIndex}
          onClick={openDeleteHabitModal}
          hidden={!selected}
        />
        <Icon
          icon="move"
          classes={['move-icon']}
          disableTabIndex={disableTabIndex}
          onMouseDown={move}
          hidden={!selected}
        />
        <Icon
          icon={visible ? 'visible' : 'hidden'}
          disableTabIndex={disableTabIndex}
          classes={!visible ? ['greyed-out'] : undefined}
          onClick={toggleVisibility}
        />
      </div>
    </div>
  );
}
