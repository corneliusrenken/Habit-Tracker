/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Habit, ListView } from '../../globalTypes';
import { MoreOptionsIcon, MoveIcon } from '../Icons/Icons';
import './list.css';

type HabitListItemProps = {
  habit: Habit;
  view: ListView;
};

function HabitListItem({
  habit, view,
}: HabitListItemProps) {
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
      {view === 'habit' && <div className="streak">{streak}</div>}
      {view === 'selection' && (
        <div className="horizontal-icons-container">
          <div className="icon"><MoveIcon /></div>
          <div className="icon"><MoreOptionsIcon /></div>
        </div>
      )}
    </div>
  );
}

export default HabitListItem;
