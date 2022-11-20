import React from 'react';
import { Habit } from '../../globalTypes';
import './list.css';
import ListItem from './ListItem';

type Props = {
  habit: Habit;
};

function ListItemHabitView({ habit }: Props) {
  const { done, name, streak } = habit;

  return (
    <ListItem
      habit={habit}
      content={(
        <>
          <div className={`name${done ? ' greyed-out' : ''}`}>{name}</div>
          <div className={`streak${done ? ' greyed-out' : ''}`}>{streak}</div>
        </>
      )}
    />
  );
}

export default ListItemHabitView;
