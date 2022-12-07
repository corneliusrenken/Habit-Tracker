import React from 'react';
import { Habit, Streaks } from '../../globalTypes';
import HabitListItem from './HabitListItem';

type Props = {
  habits: Habit[];
  streaks: Streaks;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  selectedIndex: number | null;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
};

export default function HabitList({
  habits, streaks, todaysOccurrences, selectedIndex, updateHabitCompleted,
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
            toggleCompleted={() => updateHabitCompleted(id, !completed)}
          />
        );
      })}
    </div>
  );
}
