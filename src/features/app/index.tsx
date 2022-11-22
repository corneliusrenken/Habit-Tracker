import React, { useEffect, useMemo, useState } from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit, ListView, OccurrencesApiData, View,
} from '../../globalTypes';
import Dates from '../dates';
import Days from '../days';
import List from '../list';
import Occurrences from '../occurrences';
import TransitionManager from '../transitionManager';
import getOccurrencesFromApiData from './getOccurrencesFromApiData';
import getBodyHeight from './getBodyHeight';

const habitsSeed: Habit[] = [
  {
    id: 1,
    name: 'run',
    done: false,
    visible: true,
    streak: 5,
    order: 2,
  },
  {
    id: 2,
    name: 'practice guitar',
    done: false,
    visible: true,
    streak: 12,
    order: 0,
  },
  {
    id: 3,
    name: 'verylongveryverylongveryverylongveryverylongveryverylongveryverylongvery',
    done: false,
    visible: true,
    streak: 12123123892713,
    order: 1,
  },
  {
    id: 4,
    name: 'listen to music',
    done: false,
    visible: true,
    streak: 12123123892713,
    order: 3,
  },
];

const apiResult: OccurrencesApiData = {
  oldest: {
    1: '2022-10-18',
    2: '2022-11-20',
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
  },
};

function App() {
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(habitsSeed);
  const [view, setView] = useState<View>('habit');
  const [latchedListView, setLatchedListView] = useState<ListView>('habit');
  const [focusId] = useState<number | undefined>(undefined);

  const setViewWrapper = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      setLatchedListView(v);
    }
    setView(v);
  };

  const dayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  const occurrences = useMemo(() => (
    getOccurrencesFromApiData(apiResult, focusId, dayObject.weekDateStrings[6])
  ), [dayObject, focusId]);

  const occurrencesComponent = useMemo(() => (
    <Occurrences
      occurrences={occurrences}
      displayed={view === 'history' || view === 'focus'}
    />
  ), [occurrences, view]);

  const datesComponent = useMemo(() => (
    <Dates
      occurrences={occurrences}
      todaysIndex={dayObject.weekDayIndex}
    />
  ), [occurrences, dayObject]);

  const daysComponent = useMemo(() => (
    <Days
      weekDays={dayObject.weekDays}
      occurrences={occurrences}
    />
  ), [dayObject, occurrences]);

  const listComponent = useMemo(() => (
    <List
      habits={habits}
      setHabits={setHabits}
      view={latchedListView}
    />
  ), [habits, latchedListView]);

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
      bodyHeight={getBodyHeight(view, habits, occurrences)}
      occurrences={occurrencesComponent}
      days={daysComponent}
      dates={datesComponent}
      list={listComponent}
    />
  );
}

export default App;
