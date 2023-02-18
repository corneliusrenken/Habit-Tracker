import React from 'react';
import {
  Habit,
  ListView,
  ModalContentGenerator,
  OccurrenceData,
  Streaks,
  ViewType,
} from '../../globalTypes';
import HabitList from './HabitList';
import SelectionList from './SelectionList';

type Props = {
  viewType: ViewType;
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
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  addHabit: (name: string) => void;
  deleteHabit: (habitId: number) => void;
  updateHabitListPosition: (habitId: number, newPosition: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function List({
  viewType,
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
  setModalContentGenerator,
  addHabit,
  deleteHabit,
  updateHabitListPosition,
  updateHabitName,
  updateOccurrenceCompleted,
  updateOccurrenceVisibility,
}: Props) {
  return (
    <div className="list" style={{ opacity: viewType === 'list' ? 1 : 0 }}>
      {latchedListView.name !== 'selection' ? (
        <HabitList
          habits={selectedHabits}
          streaks={streaks}
          todaysOccurrences={todaysOccurrences}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          updateOccurrenceCompleted={updateOccurrenceCompleted}
        />
      ) : (
        <SelectionList
          setModalContentGenerator={setModalContentGenerator}
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
          updateHabitListPosition={updateHabitListPosition}
          updateHabitName={updateHabitName}
          updateOccurrenceVisibility={updateOccurrenceVisibility}
        />
      )}
    </div>
  );
}
