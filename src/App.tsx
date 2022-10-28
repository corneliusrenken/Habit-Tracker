import React, { useEffect, useState } from 'react';
import Dates from './Dates';
import Days from './Days';
import getTextWidthInPx from './getTextWidthInPx';
import { Habit, View } from './globalTypes';
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

// temp for development
function getBodyHeight(view: View) {
  switch (view) {
    case 'habit': return 200;
    case 'history': return 1000;
    case 'focus': return 300;
    case 'selection': return 250;
    default: return 0;
  }
}

function App() {
  const [view, setView] = useState<View>('habit');
  // const [focusId, setFocusId] = useState<number | undefined>(undefined);

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
      setView={setView}
      bodyHeight={getBodyHeight(view)}
      dates={<Dates dates={dates} todaysIndex={1} />}
      days={<Days />}
      list={<List habits={habits} />}
    />
  );
}

export default App;
