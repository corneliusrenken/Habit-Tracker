import React, { useEffect } from 'react';
import './list.css';
import { Habit } from '../../globalTypes';
import ListItemHabitView from './ListItemHabitView';
import Selector from './Selector';

type Props = {
  habits: Habit[];
  selectorIndex: number;
  getHabitAtSelector: () => Habit;
  modifyHabitProperties: (id: number, newProperties: Partial<Omit<Habit, 'id'>>) => void;
};

function ListHabitView({
  habits, selectorIndex, getHabitAtSelector, modifyHabitProperties,
}: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const habit = getHabitAtSelector();
        modifyHabitProperties(habit.id, { done: !habit.done });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [getHabitAtSelector, modifyHabitProperties]);

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
