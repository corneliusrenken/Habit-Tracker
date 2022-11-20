import React, { useEffect, useState } from 'react';
import { Habit, ListView } from '../../globalTypes';
import './list.css';
import ListHabitView from './ListHabitView';
import ListSelectionView from './ListSelectionView';

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
          setHabits={setHabits}
        />
      ) : (
        <ListSelectionView
          habits={habits}
          selectorIndex={selectorIndex}
          setHabits={setHabits}
        />
      )}
    </div>
  );
}

export default List;
