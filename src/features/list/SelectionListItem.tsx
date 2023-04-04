import React, { useRef } from 'react';
import { Habit, ModalGenerator } from '../../globalTypes';
import IconButton from './IconButton';
import CustomForm from './CustomForm';
import getInputValidationError from './getInputValidationError';
import createDeleteHabitModalGenerator from '../deleteHabitModal';

type Props = {
  styleAdditions: React.CSSProperties;
  classNameAdditions: string;
  ignoreMouse: boolean;
  habit: Habit;
  visible: boolean;
  move: React.MouseEventHandler<HTMLButtonElement>;
  selected: boolean;
  select: undefined | (() => void);
  toggleVisibility: () => void;
  renameHabit: (newName: string) => void;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  habits: Habit[];
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function SelectionListItem({
  styleAdditions,
  classNameAdditions,
  ignoreMouse,
  habit,
  visible,
  move,
  selected,
  select,
  toggleVisibility,
  renameHabit,
  inInput,
  setInInput,
  habits,
  setModal,
  deleteHabit,
}: Props) {
  const ignoreNextMouseUp = useRef(false);

  const beingRenamed = selected && inInput;

  let containerClassName = 'list-item';
  if (selected) containerClassName += ' selected';
  if (beingRenamed) containerClassName += ' being-renamed';
  containerClassName += ` ${classNameAdditions}`;

  return (
    <div
      className={containerClassName}
      onMouseEnter={ignoreMouse ? undefined : select}
      style={styleAdditions}
    >
      <CustomForm
        active={beingRenamed}
        setActive={(active) => {
          if (active) {
            setInInput(true);
          } else {
            setInInput(false);
          }
        }}
        placeholder={habit.name}
        initialValue={habit.name}
        getInputValidationError={(newName) => {
          if (newName === habit.name) return '';
          return getInputValidationError(newName, { habits });
        }}
        onSubmit={(newName) => {
          if (newName !== habit.name) renameHabit(newName);
          setInInput(false);
        }}
        placeholderClassOverwrite="name"
        formClassOverwrite="rename-form"
      />
      <IconButton
        icon="rename"
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
        classNameAdditions={`rename-icon${beingRenamed ? ' greyed-out' : ''}`}
        hidden={!selected}
      />
      <IconButton
        icon="trash"
        onClick={() => {
          const modalGenerator: ModalGenerator = createDeleteHabitModalGenerator(habit, {
            deleteHabit,
            setModal,
          });
          setModal(() => modalGenerator);
        }}
        hidden={!selected}
      />
      <IconButton
        icon="move"
        classNameAdditions="move-icon"
        onMouseDown={move}
        hidden={!selected}
      />
      <IconButton
        icon={visible ? 'visible' : 'hidden'}
        classNameAdditions={!visible ? 'greyed-out' : undefined}
        onClick={toggleVisibility}
      />
    </div>
  );
}
