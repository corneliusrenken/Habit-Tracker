import React from 'react';
import { Habit } from './globalTypes';
import './list.css';

type ListProps = {
  habits: Habit[];
};

function List({ habits }: ListProps) {
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
    </div>
  );
}

export default List;
