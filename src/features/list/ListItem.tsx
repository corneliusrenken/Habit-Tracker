/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Habit } from '../../globalTypes';
import './list.css';

type Props = {
  habit: Habit;
  content: JSX.Element;
};

function ListItem({ habit, content }: Props) {
  const {
    id, order,
  } = habit;

  return (
    <div
      key={id}
      className="list-item"
      style={{ top: `${order * 50}px` }}
    >
      {content}
    </div>
  );
}

export default ListItem;
