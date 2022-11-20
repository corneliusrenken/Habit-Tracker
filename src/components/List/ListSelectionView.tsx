import React, { useState } from 'react';
import './list.css';
import { Habit } from '../../globalTypes';
import ListItemSelectionView from './ListItemSelectionView';
import Selector from './Selector';

function addHabit(name: string, habits: Habit[], setHabits: Function) {
  const copy = habits.slice();
  copy.push({
    // temp id
    id: new Date().getTime(),
    name,
    order: copy.length,
    streak: 0,
  });
  setHabits(copy);
}

type Props = {
  habits: Habit[];
  selectorIndex: number;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

function ListSelectionView({ habits, selectorIndex, setHabits }: Props) {
  const [activeIndex, setActiveIndex] = useState<undefined | number>(undefined);
  const [addHabitInput, setAddHabitInput] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addHabitInput) {
      addHabit(addHabitInput, habits, setHabits);
      setAddHabitInput('');
    }
  };

  return (
    <>
      <Selector index={selectorIndex} />

      {habits.map((habit) => (
        <ListItemSelectionView
          key={habit.id}
          habit={habit}
          selected={habit.order === selectorIndex}
          active={habit.order === activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}

      <form style={{ top: `${habits.length * 50}px` }} onSubmit={onSubmit}>
        <input
          type="text"
          value={addHabitInput}
          onChange={(e) => setAddHabitInput(e.target.value)}
          placeholder="add habit"
        />
      </form>
    </>
  );
}

export default ListSelectionView;
