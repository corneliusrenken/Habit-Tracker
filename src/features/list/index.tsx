import React from 'react';
import {
  ApiFunctions, Habit, ListView, Streaks,
} from '../../globalTypes';
import HabitList from './HabitList';
import SelectionList from './SelectionList';
import './list.css';

type Props = {
  selectedHabits: Habit[];
  streaks: Streaks;
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  listView: ListView;
  selectedIndex: number | null;
  setSelectedIndex: (newIndex: number | null) => void;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  apiFunctions: ApiFunctions;
};

export default function List({
  selectedHabits,
  streaks,
  todaysOccurrences,
  listView,
  apiFunctions,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
}: Props) {
  return (
    <div>
      {listView === 'habit' ? (
        <HabitList
          habits={selectedHabits}
          streaks={streaks}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          apiFunctions={apiFunctions}
        />
      ) : (
        <SelectionList
          habits={selectedHabits}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          inInput={inInput}
          setInInput={setInInput}
          apiFunctions={apiFunctions}
        />
      )}
    </div>
  );
}
