import React, { useEffect, useMemo, useState } from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit, ListView, OccurrenceData, Streaks, View,
} from '../../globalTypes';
import Dates from '../dates';
import Days from '../days';
import List from '../list';
import Occurrences from '../occurrences';
import TransitionManager from '../transitionManager';
import getSelectedOccurrences from './getSelectedOccurrences';
import getBodyHeight from './getBodyHeight';

const habitsSeed: Habit[] = [
  {
    id: 2,
    name: 'practice guitar',
    order: 0,
  },
  {
    id: 3,
    name: 'verylongveryverylongveryverylongveryverylongveryverylongveryverylongvery',
    order: 1,
  },
  {
    id: 1,
    name: 'run',
    order: 2,
  },
  {
    id: 4,
    name: 'listen to music',
    order: 3,
  },
];

const occurrenceDataSeed: OccurrenceData = {
  oldest: {
    1: '2022-10-18',
    2: null,
    3: '2022-11-19',
    4: '2022-11-20',
  },
  dates: {
    '2022-11-18': {
      1: true,
      4: false,
    },
    '2022-11-19': {
      1: false,
      2: false,
      3: true,
      4: false,
    },
    '2022-11-20': {
      1: true,
      2: true,
      3: true,
      4: true,
    },
    '2022-11-25': {
      1: true,
      2: true,
      3: true,
      4: true,
    },
    '2022-11-26': {
      1: true,
      2: true,
      3: true,
      4: true,
    },
    '2022-11-28': {
      // 1: true,
      2: true,
      3: false,
      4: true,
    },
  },
};

const streaksSeed: Streaks = {
  1: { current: 1, maximum: 5 },
  2: { current: 33, maximum: 5 },
  3: { current: 123, maximum: 5 },
  4: { current: 5, maximum: 5 },
};

function App() {
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday] = useState(false);
  const [view, setView] = useState<View>('habit');
  const [latchedListView, setLatchedListView] = useState<ListView>('habit');
  const [focusId] = useState<number | undefined>(undefined);

  const [habits, setHabits] = useState<Habit[]>(habitsSeed);
  const [occurrenceData] = useState<OccurrenceData>(occurrenceDataSeed);
  const [streaks] = useState<Streaks>(streaksSeed);

  const setViewWrapper = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      setLatchedListView(v);
    }
    setView(v);
  };

  const dayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  const selectedOccurrences = useMemo(() => (
    getSelectedOccurrences(occurrenceData, focusId, dayObject.weekDateStrings[6])
  ), [occurrenceData, dayObject, focusId]);

  useEffect(() => {
    const firstDate = Number(dayObject.weekDateStrings[0].slice(-2));
    const lastDate = Number(dayObject.weekDateStrings[6].slice(-2));
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDate, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDate, 15)) / 2}px`);
  }, [dayObject]);

  return (
    <TransitionManager
      view={view}
      setView={setViewWrapper}
      bodyHeight={getBodyHeight(view, habits, selectedOccurrences)}
      occurrences={(
        <Occurrences
          displayed={view === 'history' || view === 'focus'}
          selectedOccurrences={selectedOccurrences}
        />
      )}
      days={(
        <Days
          weekDays={dayObject.weekDays}
          selectedOccurrences={selectedOccurrences}
        />
      )}
      dates={(
        <Dates
          todaysIndex={dayObject.weekDayIndex}
          selectedOccurrences={selectedOccurrences}
        />
      )}
      list={(
        <List
          habits={habits}
          streaks={streaks}
          setHabits={setHabits}
          todaysOccurrences={occurrenceData.dates[dayObject.date] || []}
          view={latchedListView}
        />
      )}
    />
  );
}

export default App;
