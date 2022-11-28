import React from 'react';
import { Habit, Streaks } from '../../globalTypes';
import HabitListItem from './HabitListItem';

type Props = {
  habits: Habit[];
  streaks: Streaks;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
};

export default function HabitList({ habits, streaks, todaysOccurrences }: Props) {
  return (
    <div>
      {habits.map(({ name, id }) => {
        const done = todaysOccurrences[id];

        return (
          <HabitListItem
            key={id}
            name={name}
            streak={streaks[id].current}
            done={done}
          />
        );
      })}
    </div>
  );
}
