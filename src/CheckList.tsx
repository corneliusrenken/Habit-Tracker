import React from 'react';
import ChecklistItem from './CheckListItem';
import { Habit } from './types';

type ChecklistProps = {
  habits: Array<Habit>;
};

function Checklist({ habits }: ChecklistProps) {
  return (
    <div>
      {habits.map((habit) => (
        <ChecklistItem habit={habit} />
      ))}
    </div>
  );
}

export default Checklist;
