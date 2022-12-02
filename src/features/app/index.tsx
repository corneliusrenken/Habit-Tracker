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
import shortcutManager from './shortcutManager';

function App() {
  const userId = 1;
  const [dateObject] = useState(getDateObject(6));
  const [displayingYesterday, setDisplayingYesterday] = useState(false);
  const [view, _setView] = useState<View>('habit'); // eslint-disable-line @typescript-eslint/naming-convention, max-len
  const [listView, setListView] = useState<ListView>('habit');
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const [selectedIndex, _setSelectedIndex] = useState(0); // eslint-disable-line @typescript-eslint/naming-convention, max-len
  const [inInput, setInInput] = useState(false);
  const [inTransition, setInTransition] = useState(false);

  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();

  const dayObject = useMemo(() => (
    displayingYesterday ? dateObject.yesterday : dateObject.today
  ), [dateObject, displayingYesterday]);

  const setView = (v: View) => {
    if (v === 'habit' || v === 'selection') {
      setListView(v);
    }

    _setView(v);
  };

  const selectedHabits = useMemo(() => {
    if (!habits || !occurrenceData?.dates) return [];
    return listView === 'habit'
      ? habits.filter(({ id }) => occurrenceData.dates[dayObject.dateString][id] !== undefined)
      : habits;
  }, [dayObject.dateString, habits, listView, occurrenceData?.dates]);

  const setSelectedIndex = useCallback((newIndex: number) => {
    const maxIndex = view === 'selection' ? selectedHabits.length : selectedHabits.length - 1;
    _setSelectedIndex(Math.max(0, Math.min(newIndex, maxIndex)));
  }, [view, selectedHabits]);

  useEffect(() => {
    if (!habits) return;

    const onKeyDown = (e: KeyboardEvent) => shortcutManager(e, {
      inTransition,
      displayingYesterday,
      habits,
      inInput,
      selectedIndex,
      setDisplayingYesterday,
      setFocusId,
      setSelectedIndex,
      setView,
      view,
    });

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown); // eslint-disable-line consistent-return, max-len
  }, [displayingYesterday,
    habits,
    inInput,
    inTransition,
    selectedIndex,
    setSelectedIndex,
    view,
  ]);

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
      setInTransition={setInTransition}
      view={view}
      bodyHeight={getBodyHeight(view, habits, selectedOccurrences)}
      occurrences={(
        <Occurrences
          displayed={view === 'history'}
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
          selectedHabits={selectedHabits}
          streaks={streaks}
          todaysOccurrences={occurrenceData.dates[dayObject.dateString]}
          listView={listView}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          setInInput={setInInput}
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
