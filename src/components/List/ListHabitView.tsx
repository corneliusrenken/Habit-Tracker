import React from 'react';
import './list.css';
import { Habit } from '../../globalTypes';
import ListItemHabitView from './ListItemHabitView';
import Selector from './Selector';

type Props = {
  habits: Habit[];
  selectorIndex: number;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ListHabitView({ habits, selectorIndex, setHabits }: Props) {
  return (
    <>
      {(habits.length > 0) && (
        <Selector index={selectorIndex} />
      )}

      {habits.map((habit) => (
        <ListItemHabitView
          key={habit.id}
          habit={habit}
        />
      ))}
    </>
  );
}

export default ListHabitView;
