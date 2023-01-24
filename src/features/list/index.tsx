import React from 'react';
import {
  Habit,
  ListView,
  OccurrenceData,
  Streaks,
} from '../../globalTypes';
import HabitList from './HabitList';
import SelectionList from './SelectionList';
import './list.css';

type Props = {
  allowTabTraversal: boolean;
  selectedHabits: Habit[];
  streaks: Streaks;
  todaysOccurrences: OccurrenceData['dates'][string];
  latchedListView: ListView;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  addHabit: (name: string) => Promise<void>;
  deleteHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitOrder: (habitId: number, newOrder: number) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function List({
  allowTabTraversal,
  selectedHabits,
  streaks,
  todaysOccurrences,
  latchedListView,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
  reorderingList,
  setReorderingList,
  addHabit,
  deleteHabit,
  renameHabit,
  updateHabitCompleted,
  updateHabitOrder,
  updateHabitVisibility,
}: Props) {
  return (
    <div>
      {latchedListView.name !== 'selection' ? (
        <HabitList
          habits={selectedHabits}
          streaks={streaks}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          updateHabitCompleted={updateHabitCompleted}
        />
      ) : (
        <SelectionList
          allowTabTraversal={allowTabTraversal}
          habits={selectedHabits}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          inInput={inInput}
          setInInput={setInInput}
          reorderingList={reorderingList}
          setReorderingList={setReorderingList}
          addHabit={addHabit}
          deleteHabit={deleteHabit}
          renameHabit={renameHabit}
          updateHabitOrder={updateHabitOrder}
          updateHabitVisibility={updateHabitVisibility}
        />
      )}
    </div>
  );
}
