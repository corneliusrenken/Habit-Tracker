import React, { useEffect, useRef, useState } from 'react';
import { ApiFunctions, Habit } from '../../globalTypes';
import isValidHabitName from './isValidHabitName';
import ReorderableList from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type Props = {
  habits: Habit[];
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  selectedIndex: number | null;
  setSelectedIndex: (newIndex: number | null) => void;
  apiFunctions: ApiFunctions;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

type ElementConstructor = {
  id: number;
  // eslint-disable-next-line max-len
  elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => () => JSX.Element;
};

export default function SelectionList({
  habits, todaysOccurrences, selectedIndex, setSelectedIndex, apiFunctions, inInput, setInInput,
}: Props) {
  const [habitInput, setHabitInput] = useState('');
  const habitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedIndex === habits.length) {
      habitInputRef.current?.focus();
    } else {
      habitInputRef.current?.blur();
    }
  }, [selectedIndex, habits.length]);

  const elementConstructors: ElementConstructor[] = habits.map(({ id, name }, index) => ({
    id,
    elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
      const visible = todaysOccurrences[id] !== undefined;

      return () => (
        <SelectionListItem
          name={name}
          move={onMouseDown}
          visible={visible}
          selected={selectedIndex === index}
          toggleVisibility={() => apiFunctions.updateHabitVisibility(id, !visible)}
          removeHabit={() => apiFunctions.removeHabit(id)}
          renameHabit={(newName: string) => {
            apiFunctions.renameHabit(id, newName);
          }}
          inInput={inInput}
          setInInput={setInInput}
          habits={habits}
        />
      );
    },
  }));

  return (
    <>
      <ReorderableList
        elementConstructors={elementConstructors}
        height={50}
        width={350}
        onIndexChange={(newIndicesById, changedId) => {
          apiFunctions.updateHabitOrder(changedId, newIndicesById[changedId]);
        }}
      />
      <form
        style={{ top: `${habits.length * 50}px` }}
        onSubmit={(e) => {
          e.preventDefault();
          const trimmedHabitInput = habitInput.trim();
          const validation = isValidHabitName(trimmedHabitInput, { habits });
          if (validation === true) {
            apiFunctions.addHabit(trimmedHabitInput);
            setHabitInput('');
          } else {
            console.error(validation); // eslint-disable-line no-console
          }
        }}
      >
        <input
          ref={habitInputRef}
          type="text"
          placeholder="add habit"
          value={habitInput}
          onFocus={() => {
            setInInput(true);
            setSelectedIndex(habits.length);
          }}
          onBlur={() => {
            setInInput(false);
            if (habits.length === 0) {
              setSelectedIndex(null);
            } else {
              setSelectedIndex(habits.length - 1);
            }
          }}
          onChange={(e) => setHabitInput(e.target.value)}
        />
      </form>
    </>
  );
}
