import React, { useEffect, useState } from 'react';
import getTextWidthInPx from '../../functions/getTextWidthInPx';
import {
  Habit, ListView, Occurrence, View,
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
    streak: 5,
    order: 2,
  },
  {
    id: 2,
    name: 'practice guitar',
    streak: 12,
    order: 0,
  },
  {
    id: 3,
    name: 'verylongveryverylongveryverylongveryverylongveryverylongveryverylongvery',
    streak: 12123123892713,
    order: 1,
  },
  {
    id: 4,
    name: 'listen to music',
    streak: 12123123892713,
    order: 3,
  },
];

const occurrences: Occurrence[] = [
  { date: 1, complete: true },
  { date: 2, complete: false },
  { date: 3, complete: false },
  { date: 4, complete: true },
  { date: 5, complete: true },
  { date: 6, complete: false },
  { date: 7, complete: false },
  { date: 8, complete: true },
  { date: 9, complete: true },
  { date: 10, complete: false },
  { date: 11, complete: false },
  { date: 12, complete: false },
  { date: 13, complete: false },
  { date: 14, complete: true },
  { date: 15, complete: true },
  { date: 16, complete: true },
  { date: 17, complete: true },
  { date: 18, complete: false },
  { date: 19, complete: true },
  { date: 20, complete: false },
  { date: 21, complete: false },
  { date: 22, complete: true },
  { date: 23, complete: false },
  { date: 24, complete: true },
  { date: 25, complete: true },
  { date: 26, complete: false },
  { date: 27, complete: false },
  { date: 28, complete: false },
];

// temp for development
function getBodyHeight(view: View, habits: Habit[]) {
  switch (view) {
    case 'habit': return habits.length * 50;
    case 'history': return (occurrences.length / 7) * 50;
    case 'focus': return 300;
    case 'selection': return habits.length * 50 + 50;
    default: return 0;
  }
}

function App() {
  const [habits, setHabits] = useState<Habit[]>(habitsSeed);
  const [view, setView] = useState<View>('habit');
  const [latchedListView, setLatchedListView] = useState<ListView>('habit');
  // const [focusId, setFocusId] = useState<number | undefined>(undefined);

  const setViewWrapper = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      setLatchedListView(v);
    }
    setView(v);
  };

  // these states allow calculating any body height
  // - habit: habit array length
  // - selected: habit array length + 1
  // - history: occurences length
  // - focus: occurrences[focus id] length

  const [dates] = useState([1, 6, 7, 8, 9, 10, 30]);

  useEffect(() => {
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(dates[0], 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(dates[6], 15)) / 2}px`);
  }, [dates]);

  return (
    <TransitionManager
      view={view}
      setView={setViewWrapper}
      bodyHeight={getBodyHeight(view, habits)}
      occurrences={<Occurrences occurrences={occurrences} displayed={view === 'history' || view === 'focus'} />}
      dates={<Dates dates={dates} todaysIndex={1} />}
      days={<Days />}
      list={<List habits={habits} setHabits={setHabits} view={latchedListView} />}
    />
  );
}

export default App;
