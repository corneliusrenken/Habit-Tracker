import React from 'react';
import { ApiFunctions, Habit, Streaks } from '../../globalTypes';
import HabitListItem from './HabitListItem';

type Props = {
  habits: Habit[];
  streaks: Streaks;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  selectedIndex: number;
  apiFunctions: ApiFunctions;
};

export default function HabitList({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  habits, streaks, todaysOccurrences, selectedIndex, apiFunctions,
}: Props) {
  return (
    <div>
      {habits.map(({ name, id }, index) => {
        const completed = todaysOccurrences[id];
        const selected = index === selectedIndex;

        return (
          <HabitListItem
            key={id}
            name={name}
            streak={streaks[id].current}
            completed={completed}
            selected={selected}
            toggleCompleted={() => apiFunctions.updateHabitCompleted(id, !completed)}
          />
        );
      })}
    </div>
  );
}
