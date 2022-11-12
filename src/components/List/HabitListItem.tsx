/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Habit, ListView } from '../../globalTypes';
import Icon from '../Icon/Icon';
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
      {view === 'selection' && selected && (
        <div
          className="horizontal-icons-container"
        >
          <Icon icon="move" />
          <Icon
            icon="more options"
            onClick={() => {
              if (active) {
                setActiveIndex(undefined);
              } else {
                setActiveIndex(habit.order);
              }
            }}
            classes={active ? ['selected'] : undefined}
          />
        </div>
      )}
      {view === 'selection' && active && (
        <div className="vertical-icons-container">
          <Icon icon="shown" />
          <Icon icon="rename" />
          <Icon icon="trash" />
        </div>
      )}
    </div>
  );
}

export default HabitListItem;
