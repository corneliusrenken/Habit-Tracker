import React, { useState } from 'react';
import './list.css';
import { Habit } from '../../globalTypes';
import ListItemSelectionView from './ListItemSelectionView';
import Selector from './Selector';

type Props = {
  habits: Habit[];
  selectorIndex: number;
  addHabit: (name: string) => void;
  removeHabit: (id: number) => void;
  modifyHabitProperties: (id: number, newProperties: Partial<Omit<Habit, 'id'>>) => void;
};

function ListSelectionView({
  habits,
  selectorIndex,
  addHabit,
  removeHabit,
  modifyHabitProperties,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<undefined | number>(undefined);
  const [addHabitInput, setAddHabitInput] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addHabitInput) {
      addHabit(addHabitInput);
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
          toggleVisible={() => modifyHabitProperties(habit.id, { visible: !habit.visible })}
          renameHabit={(name: string) => modifyHabitProperties(habit.id, { name })}
          removeHabit={() => removeHabit(habit.id)}
          setActiveIndex={setActiveIndex}
        />
      ))}

      <form
        onSubmit={onSubmit}
        className="add-habit-form"
        style={{ top: `${habits.length * 50}px` }}
      >
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
