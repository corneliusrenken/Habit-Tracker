import React, { useMemo } from 'react';
import {
  SelectedOccurrence,
  View,
  Streaks,
  Habit,
  ListView,
  OccurrenceData,
  ModalContentGenerator,
  viewToViewType,
  OccurrenceView,
  DateObject,
} from '../../globalTypes';
import Dates from '../dates';
import Days from '../days';
import List from '../list';
import Occurrences from '../occurrences';

type States = {
  ignoreMouse: boolean;
  view: View;
  latchedListView: ListView;
  latchedOccurrenceView: OccurrenceView;
  dateObject: DateObject;
  selectedHabits: Habit[];
  selectedOccurrences: SelectedOccurrence[];
  selectedStreaks: Streaks;
  occurrenceData: OccurrenceData | undefined;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  modalContentGenerator: ModalContentGenerator | undefined;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  addHabit: (name: string) => void;
  deleteHabit: (habitId: number) => void;
  updateHabitListPosition: (habitId: number, newPosition: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedComponents({
  ignoreMouse,
  view,
  latchedListView,
  latchedOccurrenceView,
  dateObject,
  selectedHabits,
  selectedOccurrences,
  selectedStreaks,
  occurrenceData,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
  reorderingList,
  setReorderingList,
  modalContentGenerator,
  setModalContentGenerator,
  addHabit,
  deleteHabit,
  updateHabitListPosition,
  updateHabitName,
  updateOccurrenceCompleted,
  updateOccurrenceVisibility,
}: States) {
  const viewType = viewToViewType[view.name];

  const occurrences = useMemo(() => (
    <Occurrences
      latchedOccurrenceView={latchedOccurrenceView}
      viewType={viewType}
      selectedOccurrences={selectedOccurrences}
    />
  ), [latchedOccurrenceView, selectedOccurrences, viewType]);

  const days = useMemo(() => (
    <Days
      viewType={viewType}
      weekDays={dateObject.weekDays}
      selectedOccurrences={selectedOccurrences}
    />
  ), [viewType, dateObject.weekDays, selectedOccurrences]);

  const dates = useMemo(() => (
    <Dates
      view={view}
      dateObject={dateObject}
      selectedOccurrences={selectedOccurrences}
    />
  ), [view, dateObject, selectedOccurrences]);

  const list = useMemo(() => (
    occurrenceData !== undefined
      ? (
        <List
          ignoreMouse={ignoreMouse}
          viewType={viewType}
          allowTabTraversal={modalContentGenerator === undefined}
          selectedHabits={selectedHabits}
          streaks={selectedStreaks}
          todaysOccurrences={(latchedListView.name === 'yesterday'
            ? occurrenceData.dates[dateObject.yesterday.dateString]
            : occurrenceData.dates[dateObject.today.dateString]
          )}
          latchedListView={latchedListView}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          inInput={inInput}
          setInInput={setInInput}
          reorderingList={reorderingList}
          setReorderingList={setReorderingList}
          setModalContentGenerator={setModalContentGenerator}
          addHabit={addHabit}
          deleteHabit={deleteHabit}
          updateHabitListPosition={updateHabitListPosition}
          updateHabitName={updateHabitName}
          updateOccurrenceCompleted={updateOccurrenceCompleted}
          updateOccurrenceVisibility={updateOccurrenceVisibility}
        />
      )
      : <div />
  ), [
    ignoreMouse,
    dateObject,
    viewType,
    modalContentGenerator,
    selectedStreaks,
    latchedListView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    inInput,
    setInInput,
    reorderingList,
    setReorderingList,
    setSelectedIndex,
    setModalContentGenerator,
    addHabit,
    deleteHabit,
    updateHabitListPosition,
    updateHabitName,
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
  ]);

  return {
    occurrences,
    days,
    dates,
    list,
  };
}
