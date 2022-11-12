/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Habit, ListView } from '../../globalTypes';
import {
  MoreOptionsIcon, MoveIcon, RenameIcon, ShownIcon, TrashIcon,
} from '../Icons/Icons';
import './list.css';

type HabitListItemProps = {
  habit: Habit;
  view: ListView;
  selected: boolean;
  active: boolean;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
};

function HabitListItem({
  habit, view, selected, active, setActiveIndex,
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
        <div
          className="horizontal-icons-container"
          style={{ opacity: selected ? 1 : 0 }}
        >
          <div
            className="icon"
          >
            <MoveIcon />
          </div>
          <div
            className={`icon${active ? ' selected' : ''}`}
            onClick={() => {
              if (active) {
                setActiveIndex(undefined);
              } else {
                setActiveIndex(habit.order);
              }
            }}
          >
            <MoreOptionsIcon />
          </div>
        </div>
      )}
      {view === 'selection' && active && (
        <div className="vertical-icons-container">
          <div
            className="icon"
          >
            <ShownIcon />
          </div>
          <div
            className="icon"
          >
            <RenameIcon />
          </div>
          <div
            className="icon"
          >
            <TrashIcon />
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitListItem;
