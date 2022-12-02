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
  listView: ListView;
  selectedIndex: number;
  setSelectedIndex: (newIndex: number) => void;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  apiFunctions: ApiFunctions;
};

export default function List({
  habits,
  streaks,
  todaysOccurrences,
  listView,
  apiFunctions,
  selectedIndex,
  setSelectedIndex,
  setInInput,
}: Props) {
  return (
    <div>
      {listView === 'habit' ? (
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
          setSelectedIndex={setSelectedIndex}
          setInInput={setInInput}
          apiFunctions={apiFunctions}
        />
      )}
    </div>
  );
}
