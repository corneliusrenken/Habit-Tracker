import React, { useEffect, useMemo, useState } from 'react';
import { getDateFromDateString, getMinimumDateString } from '../../functions/dateStringFunctions';
import getCustomDateString from '../../functions/getCustomDateString';
import getDateObject from '../../functions/getDateObject';
import getTextWidthInPx from '../../functions/getTextWidthInPx';
import {
  DayObject, Habit, ListView, Occurrence, View,
} from '../../globalTypes';
import Dates from '../Dates/Dates';
import Days from '../Days/Days';
import List from '../List/List';
import Occurrences from '../Occurrences/Occurrences';
import TransitionManager from '../TransitionManager/TransitionManager';

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

type ApiResult = {
  oldest: {
    [habitId: string]: string | undefined;
  };
  dates: {
    [dateString: string]: {
      [habitId: string]: boolean;
    };
  };
};

const apiResult: ApiResult = {
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

function getOccurrences(focusId: number | undefined, dateStringLastOfWeek: string): Occurrence[] {
  const occurences: Occurrence[] = [];

  const oldestDateString = focusId === undefined
    ? getMinimumDateString(Object.values(apiResult.oldest))
    : apiResult.oldest[focusId];

  const lastDateOfWeek = getDateFromDateString(dateStringLastOfWeek);
  const oldestDate = oldestDateString === undefined
    ? undefined
    : getDateFromDateString(oldestDateString);

  const currentDate = new Date(lastDateOfWeek);

  while (
    occurences.length < 7
    || occurences.length % 7 !== 0
    || (oldestDate !== undefined && currentDate.getTime() >= oldestDate.getTime())
  ) {
    const dateString = getCustomDateString(currentDate);
    let complete = false;
    if (apiResult.dates[dateString] !== undefined) {
      complete = focusId === undefined
        ? Object.values(apiResult.dates[dateString]).every((value) => value === true)
        : apiResult.dates[dateString][focusId] === true;
    }
    const occurence = { date: Number(dateString.slice(-2)), complete };
    occurences.push(occurence);
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return occurences.reverse();
}

function getBodyHeight(view: View, habits: Habit[], occurrences: Occurrence[]) {
  switch (view) {
    case 'habit': return habits.length * 50;
    case 'history': return (occurrences.length / 7 - 1) * 50;
    case 'focus': return (occurrences.length / 7 - 1) * 50;
    case 'selection': return habits.length * 50 + 50;
    default: return 0;
  }
}

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

  const dayObject: DayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  const occurrences: Occurrence[] = useMemo(() => (
    getOccurrences(focusId, dayObject.weekDateStrings[6])
  ), [dayObject, focusId]);

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
      occurrences={(
        <Occurrences
          occurrences={occurrences}
          displayed={view === 'history' || view === 'focus'}
        />
      )}
      dates={(
        <Dates
          occurrences={occurrences}
          todaysIndex={dayObject.weekDayIndex}
        />
      )}
      days={(
        <Days
          weekDays={dayObject.weekDays}
          occurrences={occurrences}
        />
      )}
      list={(
        <List
          habits={habits}
          setHabits={setHabits}
          view={latchedListView}
        />
      )}
    />
  );
}

export default App;
