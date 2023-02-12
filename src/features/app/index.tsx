import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import getDateObject from '../common/getDateObject';
import getTextWidthInPx from './getTextWidthInPx';
import {
  Habit,
  ListView,
  ModalContentGenerator,
  OccurrenceData,
  OccurrenceView,
  Streaks,
  View,
} from '../../globalTypes';
import initialize from './initialize';
import useMemoizedComponents from './useMemoizedComponents';
import useSelectedData from './useSelectedData';
import Modal from '../modal';
import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';
import useDataQueries from '../dataQueries/useDataQueries';

let initializedApp = false;

export default function App() {
  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // using a function in useState makes it's initializer only run once instead of on every cycle
  const [dateObject] = useState(() => getDateObject(6));
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [view, _setView] = useState<View>(() => ({ name: 'today' }));
  const [latchedListView, setLatchedListView] = useState<ListView>({ name: 'today' });
  const [latchedOccurrenceView, setLatchedOccurrenceView] = useState<OccurrenceView>({ name: 'history' });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [inInput, setInInput] = useState(false);
  const [reorderingList, setReorderingList] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  // eslint-disable-next-line max-len
  const [modalContentGenerator, setModalContentGenerator] = useState<ModalContentGenerator | undefined>(undefined);
  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();
  const layoutOptions = useRef({
    minMarginHeight: 50,
    maxListHeight: 600,
  });

  const setView = useCallback((newView: View) => {
    if (newView.name !== view.name) {
      if (newView.name === 'today' || newView.name === 'yesterday' || newView.name === 'selection') {
        setLatchedListView(newView);
      } else {
        setLatchedOccurrenceView(newView);
      }
      _setView(newView);
    }
  }, [view]);

  // improve this later...
  useEffect(() => {
    if (!initializedApp) {
      initializedApp = true;
      initialize(dateObject.today.dateString, {
        setView,
        setHabits,
        setOccurrenceData,
        setStreaks,
      });
    }
  }, [dateObject, setView]);

  const dayObject = useMemo(() => (
    latchedListView.name === 'yesterday' ? dateObject.yesterday : dateObject.today
  ), [dateObject, latchedListView]);

  useEffect(() => {
    const firstDate = Number(dayObject.weekDateStrings[0].slice(-2));
    const lastDate = Number(dayObject.weekDateStrings[6].slice(-2));
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDate, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDate, 15)) / 2}px`);
  }, [dayObject]);

  const selectedData = useSelectedData({
    dateObject,
    habits,
    occurrenceData,
    streaks,
    latchedListView,
    latchedOccurrenceView,
  });

  const {
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
  } = useDataQueries({
    dateObject,
    dayObject,
    latchedListView,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    setSelectedIndex,
  });

  const components = useMemoizedComponents({
    selectedStreaks: selectedData.streaks,
    dateObject,
    dayObject,
    latchedListView,
    latchedOccurrenceView,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    selectedOccurrences: selectedData.occurrences,
    inInput,
    setInInput,
    setSelectedIndex,
    reorderingList,
    setReorderingList,
    view,
    modalContentGenerator,
    addHabit,
    deleteHabit,
    renameHabit,
    updateHabitCompleted,
    updateHabitOrder,
    updateHabitVisibility,
    setModalContentGenerator,
  });

  useShortcutManager({
    dateObject,
    dayObject,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits: selectedData.habits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setSelectedIndex,
    reorderingList,
    setModalContentGenerator,
    deleteHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  });

  if (!habits || !occurrenceData || !streaks) return null;

  return (
    <>
      <Modal
        modalContentGenerator={modalContentGenerator}
        setModalContentGenerator={setModalContentGenerator}
      />
      <Layout
        layoutOptions={layoutOptions.current}
        view={view}
        listRows={view.name === 'selection' ? selectedData.habits.length + 1 : selectedData.habits.length}
        occurrenceRows={Math.ceil((selectedData.occurrences.length - 7) / 7)}
        setInTransition={setInTransition}
        occurrences={components.occurrences}
        days={components.days}
        dates={components.dates}
        list={components.list}
      />
    </>
  );
}
