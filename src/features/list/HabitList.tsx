import React from 'react';
import { Habit, OccurrenceData, Streaks } from '../../globalTypes';
import HabitListItem from './HabitListItem';

type Props = {
  ignoreMouse: boolean;
  habits: Habit[];
  streaks: Streaks;
  todaysOccurrences: OccurrenceData['dates'][string];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
};

export default function HabitList({
  ignoreMouse,
  habits,
  streaks,
  todaysOccurrences,
  selectedIndex,
  setSelectedIndex,
  updateOccurrenceCompleted,
}: Props) {
  return (
    <div>
      {habits.map(({ name, id }, index) => {
        const completed = todaysOccurrences[id].complete;
        const selected = index === selectedIndex;

        return (
          <HabitListItem
            ignoreMouse={ignoreMouse}
            key={id}
            name={name}
            streak={streaks[id].current}
            completed={completed}
            selected={selected}
            select={() => setSelectedIndex(index)}
            toggleCompleted={() => updateOccurrenceCompleted(id, !completed)}
          />
        );
      })}
    </div>
  );
}
