import React, { useEffect, useState } from 'react';
import Dates from './Dates';
import Days from './Days';
import getTextWidthInPx from './getTextWidthInPx';
import { Habit } from './globalTypes';
import List from './List';
import TransitionManager from './TransitionManager';

const habits: Habit[] = [
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
    name: 'very long very long very long very long very long very long very long very long',
    streak: 12123123892713,
    order: 3,
  },
];

function App() {
  const [dates] = useState([1, 6, 7, 8, 9, 10, 30]);

  useEffect(() => {
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(dates[0], 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(dates[6], 15)) / 2}px`);
  }, [dates]);

  return (
    <TransitionManager
      dates={<Dates dates={dates} todaysIndex={1} />}
      days={<Days />}
      list={<List habits={habits} />}
    />
  );
}

export default App;
