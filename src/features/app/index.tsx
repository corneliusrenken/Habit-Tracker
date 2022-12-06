import React, { useEffect, useMemo, useState } from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit, ListView, OccurrenceData, Streaks, View,
} from '../../globalTypes';
import TransitionManager from '../transitionManager';
import getBodyHeight from './getBodyHeight';
import initialize from './initialize';
import shortcutManager from './shortcutManager';
import useApiFunctions from '../apiFunctions/useApiFunctions';
import useMemoizedComponents from './useMemoizedComponents';
import useSelectedData from './useSelectedData';

function App() {
  const userId = 1;
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday, setDisplayingYesterday] = useState(false);
  const [view, _setView] = useState<View>('habit');
  const [listView, _setListView] = useState<ListView>('habit');
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [inInput, setInInput] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();

  const setView = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      _setListView(v);
    }

    _setView(v);
  };

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
    listView,
    occurrenceData,
    streaks,
  });

  const apiFunctions = useApiFunctions({
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
    apiFunctions,
    selectedStreaks: selectedData.streaks,
    dayObject,
    listView,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    selectedOccurrences: selectedData.occurrences,
    inInput,
    setInInput,
    setSelectedIndex,
    view,
  });

  useEffect(() => {
    if (!habits || !occurrenceData || !streaks || !apiFunctions) return;

    const onKeyDown = (e: KeyboardEvent) => shortcutManager(e, {
      dateObject,
      inInput,
      setInInput,
      selectedIndex,
      habits,
      selectedHabits: selectedData.habits,
      view,
      displayingYesterday,
      setView,
      setDisplayingYesterday,
      setSelectedIndex,
      setFocusId,
      inTransition,
      dayObject,
      occurrenceData,
      apiFunctions,
    });

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown); // eslint-disable-line consistent-return, max-len
  }, [
    apiFunctions,
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedData.habits,
    selectedIndex,
    streaks,
    view,
  ]);

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

export default App;
