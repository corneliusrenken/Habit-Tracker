import React from 'react';
import { ApiFunctions, Habit, Streaks } from '../../globalTypes';
import HabitListItem from './HabitListItem';

type Props = {
  habits: Habit[];
  streaks: Streaks;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  apiFunctions: ApiFunctions;
};

export default function HabitList({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  habits, streaks, todaysOccurrences, apiFunctions,
}: Props) {
  return (
    <div>
      {habits.map(({ name, id }) => {
        const completed = todaysOccurrences[id];

        return (
          <HabitListItem
            key={id}
            name={name}
            streak={streaks[id].current}
            completed={completed}
            toggleCompleted={() => apiFunctions.updateHabitCompleted(id, !completed)}
          />
        );
      })}
    </div>
  );
}
