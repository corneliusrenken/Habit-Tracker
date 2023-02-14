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
  addHabit: (name: string) => Promise<void>;
  deleteHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitCompleted: (habitId: number, completed: boolean) => void;
  updateHabitListPosition: (habitId: number, newListPosition: number) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
};

export default function useMemoizedComponents(states: States) {
  const {
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
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitListPosition,
    updateHabitVisibility,
    setModalContentGenerator,
  } = states;

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
      latchedListView={latchedListView}
      dateObject={dateObject}
      selectedOccurrences={selectedOccurrences}
    />
  ), [latchedListView, dateObject, selectedOccurrences]);

  const list = useMemo(() => (
    occurrenceData !== undefined
      ? (
        <List
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
          addHabit={addHabit}
          deleteHabit={deleteHabit}
          renameHabit={renameHabit}
          updateHabitCompleted={updateHabitCompleted}
          updateHabitListPosition={updateHabitListPosition}
          updateHabitVisibility={updateHabitVisibility}
          setModalContentGenerator={setModalContentGenerator}
        />
      )
      : <div />
  ), [
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
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitListPosition,
    updateHabitVisibility,
    setModalContentGenerator,
  ]);

  return {
    occurrences,
    days,
    dates,
    list,
  };
}
