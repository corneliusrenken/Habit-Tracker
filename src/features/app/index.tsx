import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit, ListView, OccurrenceData, Streaks, View,
} from '../../globalTypes';
import TransitionManager from '../transitionManager';
import getBodyHeight from './getBodyHeight';
import initialize from './initialize';
import useApiFunctions from '../apiFunctions/useApiFunctions';
import useMemoizedComponents from './useMemoizedComponents';
import useSelectedData from './useSelectedData';
import useShortcutManager from './useShortcutManager';

export default function App() {
  const userId = 1;
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday, setDisplayingYesterday] = useState(false);
  const [view, setView] = useState<View>('habit');
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [inInput, setInInput] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();

  const listViewRef = useRef<ListView>('habit');
  if (view === 'habit' || view === 'selection') listViewRef.current = view;

  useEffect(() => {
    initialize(userId, dateObject.today.dateString, {
      setView,
      setHabits,
      setOccurrenceData,
      setStreaks,
    });
  }, [dateObject]);

  const dayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  useEffect(() => {
    const firstDate = Number(dayObject.weekDateStrings[0].slice(-2));
    const lastDate = Number(dayObject.weekDateStrings[6].slice(-2));
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDate, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDate, 15)) / 2}px`);
  }, [dayObject]);

  const selectedData = useSelectedData({
    dateObject,
    dayObject,
    displayingYesterday,
    focusId,
    habits,
    listView: listViewRef.current,
    occurrenceData,
    streaks,
  });

  const {
    addHabit,
    removeHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  } = useApiFunctions({
    userId,
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    selectedIndex,
    setSelectedIndex,
  });

  const components = useMemoizedComponents({
    selectedStreaks: selectedData.streaks,
    dayObject,
    listView: listViewRef.current,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    selectedOccurrences: selectedData.occurrences,
    inInput,
    setInInput,
    setSelectedIndex,
    view,
    addHabit,
    removeHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  });

  useShortcutManager({
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setDisplayingYesterday,
    setSelectedIndex,
    setFocusId,
    removeHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  });

  if (!habits || !occurrenceData || !streaks) return null;

  return (
    <TransitionManager
      setInTransition={setInTransition}
      view={view}
      bodyHeight={getBodyHeight(view, habits, selectedData.occurrences)}
      occurrences={components.occurrences}
      days={components.days}
      dates={components.dates}
      list={components.list}
    />
  );
}
