import React, { memo, useMemo, useRef } from 'react';
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
import HabitList from './HabitList';
import SelectionList from './SelectionList';

type Props = {
  ignoreMouse: boolean;
  disableTabIndex: boolean;
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
  disableTabIndex,
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
  // need the ref for the memo so that it can reference itself
  const latchedListViewRef = useRef<ListView>({ name: 'today' });
  const latchedListView: ListView = useMemo(() => {
    const isListView = view.name === 'today' || view.name === 'yesterday' || view.name === 'selection';
    const isDifferentToLast = view.name !== latchedListViewRef.current.name;

    if (isListView && isDifferentToLast) {
      latchedListViewRef.current = view;
      return view;
    }
    return latchedListViewRef.current;
  }, [view]);

  return (
    <div className="list" style={{ opacity: viewToViewType[view.name] === 'list' ? 1 : 0 }}>
      {latchedListView.name !== 'selection' ? (
        <HabitList
          ignoreMouse={ignoreMouse}
          dateObject={dateObject}
          listView={latchedListView}
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
          disableTabIndex={disableTabIndex}
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
