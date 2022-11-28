import React from 'react';
import { Habit, ListView, Streaks } from '../../globalTypes';
import HabitList from './HabitList';
import SelectionList from './SelectionList';
import './list.css';

type Props = {
  habits: Habit[];
  streaks: Streaks;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  view: ListView;
};

export default function List({
  habits, streaks, setHabits, todaysOccurrences, view,
}: Props) {
  return (
    <div>
      {view === 'habit' ? (
        <HabitList
          habits={habits.filter(({ id }) => todaysOccurrences[id] !== undefined)}
          streaks={streaks}
          todaysOccurrences={todaysOccurrences}
        />
      ) : (
        <SelectionList
          habits={habits}
          todaysOccurrences={todaysOccurrences}
          setHabits={setHabits}
        />
      )}
    </div>
  );
}
