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
import initialize from './initialize';

let initialized = false;

function App() {
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday] = useState(false);
  const [view, _setView] = useState<View>('habit'); // eslint-disable-line @typescript-eslint/naming-convention
  const [latchedListView, setLatchedListView] = useState<ListView>('habit');
  const [focusId] = useState<number | undefined>(undefined);

  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();

  const setViewWrapper = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      setLatchedListView(v);
    }
    _setView(v);
  };

  const dayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  useEffect(() => {
    if (!initialized) {
      initialized = true;
      initialize(1, dayObject.dateString, { setHabits, setOccurrenceData, setStreaks });
    }
  }, [dayObject.dateString]);

  const selectedOccurrences = useMemo(() => (
    occurrenceData !== undefined
      ? getSelectedOccurrences(occurrenceData, focusId, dayObject.weekDateStrings[6])
      : []
  ), [occurrenceData, dayObject, focusId]);

  useEffect(() => {
    const firstDate = Number(dayObject.weekDateStrings[0].slice(-2));
    const lastDate = Number(dayObject.weekDateStrings[6].slice(-2));
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDate, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDate, 15)) / 2}px`);
  }, [dayObject]);

  if (!habits || !occurrenceData || !streaks) return null;

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
          todaysOccurrences={occurrenceData.dates[dayObject.dateString] || []}
          view={latchedListView}
        />
      )}
    />
  );
}

export default App;
