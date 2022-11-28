import React, { useState } from 'react';
import { Habit } from '../../globalTypes';
import ReorderableList from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type Props = {
  habits: Habit[];
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
};

type ElementConstructor = {
  id: number;
  // eslint-disable-next-line max-len
  elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => () => JSX.Element;
};

export default function SelectionList({
  habits, todaysOccurrences, setHabits,
}: Props) {
  const [habitInput, setHabitInput] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (habitInput) {
      // addHabit(habitInput);
      setHabitInput('');
    }
  };

  const elementConstructors: ElementConstructor[] = habits.map(({ id, name }) => ({
    id,
    elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => (
      () => (
        <SelectionListItem
          name={name}
          move={onMouseDown}
          selected={todaysOccurrences[id] !== undefined}
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
        onIndexChange={(newIndicesById) => {
          setHabits(
            habits
              .map((habit) => ({ ...habit, order: newIndicesById[habit.id] }))
              .sort((a, b) => a.order - b.order),
          );
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
