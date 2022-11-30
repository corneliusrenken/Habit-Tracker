import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
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
import {
  addHabit, removeHabit, renameHabit, updateHabitCompleted, updateHabitOrder, updateHabitVisibility,
} from '../apiFunctions';

function App() {
  const userId = 1;
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday] = useState(false);
  const [view, _setView] = useState<View>('habit'); // eslint-disable-line @typescript-eslint/naming-convention, max-len
  const [latchedListView, setLatchedListView] = useState<ListView>('habit');
  const [focusId] = useState<number | undefined>(undefined);
  const [selectedIndex, _setSelectedIndex] = useState(0); // eslint-disable-line @typescript-eslint/naming-convention, max-len

  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();

  const setView = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      setLatchedListView(v);
    }

    _setView(v);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setSelectedIndex = useCallback((newIndex: number) => {
    if (habits === undefined) throw new Error('setSelectedIndex should not be called before habits are initialized');

    const maxIndex = view === 'selection' ? habits.length : habits.length - 1;
    _setSelectedIndex(Math.max(0, Math.min(newIndex, maxIndex)));
  }, [view, habits]);

  const dayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  useEffect(() => {
    initialize(userId, dateObject.today.dateString, { setHabits, setOccurrenceData, setStreaks });
  }, [dateObject]);

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
      setView={setView}
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
          todaysOccurrences={occurrenceData.dates[dayObject.dateString]}
          view={latchedListView}
          selectedIndex={selectedIndex}
          apiFunctions={{
            addHabit: (name: string) => {
              addHabit(userId, name, dateObject.today.dateString, {
                habits,
                setHabits,
                occurrenceData,
                setOccurrenceData,
                streaks,
                setStreaks,
              });
            },
            removeHabit: (habitId: number) => { removeHabit(habitId, { habits, setHabits }); },
            renameHabit: (habitId: number, name: string) => {
              renameHabit(habitId, name, { habits, setHabits });
            },
            updateHabitCompleted: (habitId: number, completed: boolean) => {
              updateHabitCompleted(habitId, completed, dayObject.dateString, displayingYesterday, {
                streaks,
                setStreaks,
                occurrenceData,
                setOccurrenceData,
              });
            },
            updateHabitOrder: (habitId: number, newOrder: number) => {
              updateHabitOrder(habitId, newOrder, { habits, setHabits });
            },
            updateHabitVisibility: (habitId: number, visible: boolean) => {
              updateHabitVisibility(habitId, visible, dateObject.today.dateString, {
                streaks,
                setStreaks,
                occurrenceData,
                setOccurrenceData,
              });
            },
          }}
        />
      )}
    />
  );
}

export default App;
