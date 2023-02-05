import React, { useMemo } from 'react';
import {
  DayObject,
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
  dayObject: DayObject;
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
  updateHabitOrder: (habitId: number, newOrder: number) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedComponents(states: States) {
  const {
    view,
    latchedListView,
    latchedOccurrenceView,
    dateObject,
    dayObject,
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
    updateHabitOrder,
    updateHabitVisibility,
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
      weekDays={dayObject.weekDays}
      selectedOccurrences={selectedOccurrences}
    />
  ), [viewType, dayObject.weekDays, selectedOccurrences]);

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
          todaysOccurrences={occurrenceData.dates[dayObject.dateString]}
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
          updateHabitOrder={updateHabitOrder}
          updateHabitVisibility={updateHabitVisibility}
        />
      )
      : <div />
  ), [
    viewType,
    modalContentGenerator,
    selectedStreaks,
    dayObject.dateString,
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
    updateHabitOrder,
    updateHabitVisibility,
  ]);

  return {
    occurrences,
    days,
    dates,
    list,
  };
}
