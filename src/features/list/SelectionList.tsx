import React, { useEffect, useRef, useState } from 'react';
import { ApiFunctions, Habit } from '../../globalTypes';
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedHabitInput = habitInput.trim();
    const isUnique = habits.find(({ name }) => name === trimmedHabitInput) === undefined;
    if (trimmedHabitInput && isUnique) {
      apiFunctions.addHabit(trimmedHabitInput);
      setHabitInput('');
    } else if (!trimmedHabitInput) {
      console.error('popup: need a non empty string'); // eslint-disable-line no-console
    } else {
      console.error('popup: a habit with this name already exists'); // eslint-disable-line no-console
    }
  };

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
          inInput={inInput}
          setInInput={setInInput}
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
        onSubmit={onSubmit}
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
