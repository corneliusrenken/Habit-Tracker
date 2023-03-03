import React, { useRef } from 'react';
import { Habit } from '../../globalTypes';
import Icon from '../icon';
import CustomForm from './CustomForm';
import getInputValidationError from './getInputValidationError';

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
  const ignoreNextMouseUp = useRef(false);

  const beingRenamed = selected && inInput;

  let containerClassName = 'list-item';
  if (selected) containerClassName += ' selected';

  return (
    <div className={containerClassName} onMouseEnter={ignoreMouse ? undefined : select}>
      <CustomForm
        active={beingRenamed}
        setActive={(active) => {
          if (active) {
            setInInput(true);
          } else {
            setInInput(false);
          }
        }}
        placeholder={name}
        initialValue={name}
        getInputValidationError={(newName) => {
          if (newName === name) return '';
          return getInputValidationError(newName, { habits });
        }}
        onSubmit={(newName) => {
          if (newName !== name) renameHabit(newName);
          setInInput(false);
        }}
        containerClass="list-name"
      />
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
