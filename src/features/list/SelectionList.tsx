import React, { useState } from 'react';
import { ApiFunctions, Habit } from '../../globalTypes';
import ReorderableList from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type Props = {
  habits: Habit[];
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  apiFunctions: ApiFunctions;
};

type ElementConstructor = {
  id: number;
  // eslint-disable-next-line max-len
  elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => () => JSX.Element;
};

export default function SelectionList({
  habits, todaysOccurrences, apiFunctions,
}: Props) {
  const [habitInput, setHabitInput] = useState('');

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

  const elementConstructors: ElementConstructor[] = habits.map(({ id, name }) => ({
    id,
    elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => (
      () => (
        <SelectionListItem
          name={name}
          move={onMouseDown}
          visible={todaysOccurrences[id] !== undefined}
        />
      )
    ),
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
        className="add-habit-form"
        style={{ top: `${habits.length * 50}px` }}
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="add habit"
          value={habitInput}
          onChange={(e) => setHabitInput(e.target.value)}
        />
      </form>
    </>
  );
}
