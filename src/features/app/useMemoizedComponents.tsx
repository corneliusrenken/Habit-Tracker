import React, { useMemo } from 'react';
import {
  ApiFunctions,
  DayObject,
  SelectedOccurrence,
  View,
  Streaks,
  Habit,
  ListView,
  OccurrenceData,
} from '../../globalTypes';
import Dates from '../dates';
import Days from '../days';
import List from '../list';
import Occurrences from '../occurrences';

type States = {
  view: View;
  listView: ListView;
  dayObject: DayObject;
  selectedHabits: Habit[];
  selectedOccurrences: SelectedOccurrence[];
  currentStreaks: Streaks;
  occurrenceData: OccurrenceData | undefined;
  selectedIndex: number | null;
  setSelectedIndex: (newIndex: number | null) => void;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  apiFunctions: ApiFunctions | undefined;
};

export default function useMemoizedComponents(states: States) {
  const {
    view,
    listView,
    dayObject,
    selectedHabits,
    selectedOccurrences,
    currentStreaks,
    occurrenceData,
    selectedIndex,
    setSelectedIndex,
    inInput,
    setInInput,
    apiFunctions,
  } = states;

  const occurrences = useMemo(() => (
    <Occurrences
      displayed={view === 'history'}
      selectedOccurrences={selectedOccurrences}
    />
  ), [selectedOccurrences, view]);

  const days = useMemo(() => (
    <Days
      weekDays={dayObject.weekDays}
      selectedOccurrences={selectedOccurrences}
    />
  ), [dayObject.weekDays, selectedOccurrences]);

  const dates = useMemo(() => (
    <Dates
      todaysIndex={dayObject.weekDayIndex}
      selectedOccurrences={selectedOccurrences}
    />
  ), [dayObject.weekDayIndex, selectedOccurrences]);

  const list = useMemo(() => (
    apiFunctions !== undefined && occurrenceData !== undefined
      ? (
        <List
          selectedHabits={selectedHabits}
          streaks={currentStreaks}
          todaysOccurrences={occurrenceData.dates[dayObject.dateString]}
          listView={listView}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          inInput={inInput}
          setInInput={setInInput}
          apiFunctions={apiFunctions}
        />
      )
      : <div />
  ), [
    apiFunctions,
    currentStreaks,
    dayObject.dateString,
    listView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    inInput,
    setInInput,
    setSelectedIndex,
  ]);

  return {
    occurrences,
    days,
    dates,
    list,
  };
}
