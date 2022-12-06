import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit, ListView, OccurrenceData, Streaks, View,
} from '../../globalTypes';
import TransitionManager from '../transitionManager';
import getSelectedOccurrences from './getSelectedOccurrences';
import getBodyHeight from './getBodyHeight';
import initialize from './initialize';
import shortcutManager from './shortcutManager';
import getYesterdaysStreaks from './getYesterdaysStreaks';
import useApiFunctions from '../apiFunctions/useApiFunctions';
import useMemoizedComponents from './useMemoizedComponents';

function App() {
  const userId = 1;
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday, setDisplayingYesterday] = useState(false);
  const [view, _setView] = useState<View>('habit');
  const [listView, _setListView] = useState<ListView>('habit');
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const [selectedIndex, _setSelectedIndex] = useState(0);
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

  const selectedHabits = useMemo(() => {
    if (!habits || !occurrenceData?.dates) return [];

    const dayOccurrences = occurrenceData.dates[dayObject.dateString] || {};

    return listView === 'habit'
      ? habits.filter(({ id }) => dayOccurrences[id] !== undefined)
      : habits;
  }, [dayObject.dateString, habits, listView, occurrenceData?.dates]);

  const setSelectedIndex = useCallback((newIndex: number) => {
    const maxIndex = view === 'selection' ? selectedHabits.length : selectedHabits.length - 1;
    _setSelectedIndex(Math.max(0, Math.min(newIndex, maxIndex)));
  }, [view, selectedHabits]);

  const selectedOccurrences = useMemo(() => (
    occurrenceData !== undefined
      ? getSelectedOccurrences(occurrenceData, focusId, dayObject.weekDateStrings[6])
      : []
  ), [occurrenceData, dayObject, focusId]);

  const currentStreaks = useMemo(() => {
    if (!occurrenceData || !streaks) return {};

    return !displayingYesterday
      ? streaks
      : getYesterdaysStreaks(dateObject.today.dateString, { occurrenceData, streaks });
  }, [dateObject.today.dateString, displayingYesterday, occurrenceData, streaks]);

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
    currentStreaks,
    dayObject,
    listView,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    selectedOccurrences,
    inInput,
    setInInput,
    setSelectedIndex,
    view,
  });

  useEffect(() => {
    if (!habits || !occurrenceData || !streaks || !apiFunctions) return;

    const onKeyDown = (e: KeyboardEvent) => shortcutManager(e, {
      inInput,
      setInInput,
      selectedIndex,
      habits,
      selectedHabits,
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
    dayObject,
    displayingYesterday,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    setSelectedIndex,
    streaks,
    view,
  ]);

  if (!habits || !occurrenceData || !streaks) return null;

  return (
    <TransitionManager
      setInTransition={setInTransition}
      view={view}
      bodyHeight={getBodyHeight(view, habits, selectedOccurrences)}
      occurrences={components.occurrences}
      days={components.days}
      dates={components.dates}
      list={components.list}
    />
  );
}

export default App;
