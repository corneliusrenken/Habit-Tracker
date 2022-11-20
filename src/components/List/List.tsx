import React, { useEffect, useState } from 'react';
import { Habit, ListView } from '../../globalTypes';
import './list.css';
import ListHabitView from './ListHabitView';
import ListSelectionView from './ListSelectionView';

function addHabit(
  name: string,
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
) {
  const copy = JSON.parse(JSON.stringify(habits)) as Habit[];
  copy.push({
    id: new Date().getTime(),
    name,
    visible: true,
    done: false,
    order: habits.length,
    streak: 0,
  });
  setHabits(copy);
}

function removeHabit(
  id: number,
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
) {
  let copy = JSON.parse(JSON.stringify(habits)) as Habit[];
  const indexToRemove = copy.findIndex((habit) => habit.id === id);
  const habitToRemove = habits[indexToRemove];
  copy = copy.map((habit) => {
    if (habit.order > habitToRemove.order) {
      return { ...habit, order: habit.order - 1 };
    }
    return habit;
  });
  copy.splice(indexToRemove, 1);
  setHabits(copy);
}

function modifyHabitProperties(
  id: number,
  newProperties: Partial<Omit<Habit, 'id'>>,
  habits: Habit[],
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>,
) {
  const copy = JSON.parse(JSON.stringify(habits)) as Habit[];
  const habitIndex = copy.findIndex((h) => h.id === id);
  if (habits[habitIndex] === undefined) {
    throw new Error('no habit with such id exists');
  }
  copy[habitIndex] = Object.assign(copy[habitIndex], newProperties);
  setHabits(copy);
}

function getHabitAtSelector(selectorIndex: number, habits: Habit[]) {
  const habit = habits.find((h) => h.order === selectorIndex);
  if (habit === undefined) {
    throw new Error('no habit with such id exists');
  }
  return habit;
}

type Props = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  view: ListView;
};

function List({ habits, setHabits, view }: Props) {
  const [selectorIndex, setSelectorIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const increment = e.key === 'ArrowUp' ? -1 : 1;
        // +1 to selecting habit input in selection view
        const maxIndex = view === 'habit' ? habits.length - 1 : habits.length;
        const newIndex = Math.min(maxIndex, Math.max(0, selectorIndex + increment));
        setSelectorIndex(newIndex);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectorIndex, habits.length, view]);

  return (
    <div className="list-container">
      {view === 'habit' ? (
        <ListHabitView
          habits={habits}
          selectorIndex={selectorIndex}
          getHabitAtSelector={() => getHabitAtSelector(selectorIndex, habits)}
          modifyHabitProperties={(id: number, newProperties: Partial<Omit<Habit, 'id'>>) => {
            modifyHabitProperties(id, newProperties, habits, setHabits);
          }}
        />
      ) : (
        <ListSelectionView
          habits={habits}
          selectorIndex={selectorIndex}
          addHabit={(name: string) => addHabit(name, habits, setHabits)}
          removeHabit={(id: number) => removeHabit(id, habits, setHabits)}
          modifyHabitProperties={(id: number, newProperties: Partial<Omit<Habit, 'id'>>) => {
            modifyHabitProperties(id, newProperties, habits, setHabits);
          }}
        />
      )}
    </div>
  );
}

export default List;
