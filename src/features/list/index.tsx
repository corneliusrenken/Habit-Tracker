import React, { memo, useCallback } from 'react';
import {
  DateObject,
  Habit,
  View,
  ModalGenerator,
  OccurrenceData,
  Streaks,
  viewToViewType,
  ListView,
} from '../../globalTypes';
import useLatch from '../common/useLatch';
import HabitList from './HabitList';
import SelectionList from './SelectionList';

type Props = {
  ignoreMouse: boolean;
  dateObject: DateObject,
  view: View;
  selectedHabits: Habit[];
  selectedStreaks: Streaks;
  occurrenceData: OccurrenceData;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  addHabit: (name: string) => void;
  deleteHabit: (habitId: number) => void;
  updateHabitListPosition: (habitId: number, newPosition: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

function List({
  ignoreMouse,
  dateObject,
  view,
  selectedHabits,
  selectedStreaks,
  occurrenceData,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
  reorderingList,
  setReorderingList,
  setModal,
  addHabit,
  deleteHabit,
  updateHabitListPosition,
  updateHabitName,
  updateOccurrenceCompleted,
  updateOccurrenceVisibility,
}: Props) {
  const listView = useLatch<ListView>(
    { name: 'today' },
    useCallback((prevListView) => {
      if (view.name === 'today' || view.name === 'yesterday' || view.name === 'selection') {
        return view;
      }
      return prevListView;
    }, [view]),
  );

  return (
    <div
      className="list"
      style={{ opacity: viewToViewType[view.name] === 'list' ? 1 : 0 }}
    >
      {listView.name !== 'selection' ? (
        <HabitList
          ignoreMouse={ignoreMouse}
          dateObject={dateObject}
          listView={listView}
          occurrenceData={occurrenceData}
          habits={selectedHabits}
          selectedStreaks={selectedStreaks}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          updateOccurrenceCompleted={updateOccurrenceCompleted}
        />
      ) : (
        <SelectionList
          ignoreMouse={ignoreMouse}
          setModal={setModal}
          dateObject={dateObject}
          occurrenceData={occurrenceData}
          habits={selectedHabits}
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

export default memo(List);
