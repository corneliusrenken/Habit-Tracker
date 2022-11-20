import React from 'react';
import { Habit } from '../../globalTypes';
import './list.css';
import ListItem from './ListItem';

type Props = {
  habit: Habit;
};

function ListItemHabitView({ habit }: Props) {
  const { streak } = habit;

  return (
    <ListItem
      habit={habit}
      content={(
        <div className="streak">{streak}</div>
      )}
    />
  );
}

export default ListItemHabitView;
