import React, { useEffect, useState } from 'react';
import { Habit, ListView } from '../../globalTypes';
import HabitListItem from './HabitListItem';
import './list.css';

function addHabit(name: string, habits: Habit[], setHabits: Function) {
  const copy = habits.slice();
  copy.push({
    // temp id
    // temp id
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
  setHabits: Function;
  view: ListView;
};

function List({ habits, setHabits, view }: Props) {
  const [selectorIndex, setSelectorIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<undefined | number>(undefined);
  const [addHabitInput, setAddHabitInput] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addHabitInput) {
      addHabit(addHabitInput, habits, setHabits);
      setAddHabitInput('');
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const increment = e.key === 'ArrowUp' ? -1 : 1;
        // increase max index so user can select the -add habit- form
        const maxIndex = view === 'habit' ? habits.length - 1 : habits.length;
        const newIndex = Math.min(maxIndex, Math.max(0, selectorIndex + increment));
        setActiveIndex(undefined);
        setSelectorIndex(newIndex);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectorIndex, habits.length, view]);

  return (
    <div className="habit-container">
      {(habits.length > 0 || view === 'selection') && (
        <div
          className="selector"
          style={{ top: `${22 + selectorIndex * 50}px` }}
        />
      )}

      {habits.map((habit) => (
        <HabitListItem
          key={habit.id}
          habit={habit}
          view={view}
          selected={habit.order === selectorIndex}
          active={habit.order === activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}

      {view === 'selection' && (
        <form style={{ top: `${habits.length * 50}px` }} onSubmit={onSubmit}>
          <input
            type="text"
            value={addHabitInput}
            onChange={(e) => setAddHabitInput(e.target.value)}
            placeholder="add habit"
          />
        </form>
      )}
    </div>
  );
}

export default List;
