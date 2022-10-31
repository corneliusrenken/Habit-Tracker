import React, { useEffect, useState } from 'react';
import { Habit } from '../../globalTypes';
import './list.css';

type ListProps = {
  habits: Habit[];
};

function List({ habits }: ListProps) {
  const [selectorIndex, setSelectorIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const increment = e.key === 'ArrowUp' ? -1 : 1;
        const newIndex = Math.min(habits.length - 1, Math.max(0, selectorIndex + increment));
        setSelectorIndex(newIndex);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectorIndex, habits.length]);

  return (
    <div className="habit-container">
      {habits.map((habit) => {
        const {
          id, name, streak, order,
        } = habit;

        return (
          <div
            key={id}
            className="habit"
            style={{ top: `${order * 50}px` }}
          >
            <div className="name">{name}</div>
            <div className="streak">{streak}</div>
          </div>
        );
      })}
      {habits.length > 0 && (
        <div
          className="selector"
          style={{ top: `${22 + selectorIndex * 50}px` }}
        />
      )}
    </div>
  );
}

export default List;
