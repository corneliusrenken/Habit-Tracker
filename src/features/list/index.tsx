import React from 'react';
import {
  ApiFunctions, Habit, ListView, Streaks,
} from '../../globalTypes';
import HabitList from './HabitList';
import SelectionList from './SelectionList';
import './list.css';

type Props = {
  habits: Habit[];
  streaks: Streaks;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  view: ListView;
  selectedIndex: number;
  apiFunctions: ApiFunctions;
};

export default function List({
  habits, streaks, todaysOccurrences, view, apiFunctions, selectedIndex,
}: Props) {
  return (
    <div>
      {view === 'habit' ? (
        <HabitList
          habits={habits.filter(({ id }) => todaysOccurrences[id] !== undefined)}
          streaks={streaks}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          apiFunctions={apiFunctions}
        />
      ) : (
        <SelectionList
          habits={habits}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          apiFunctions={apiFunctions}
        />
      )}
    </div>
  );
}
