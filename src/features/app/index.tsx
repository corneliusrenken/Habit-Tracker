import React, {
  useEffect, useMemo, useState,
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
import TransitionManager from '../transitionManager';
import getBodyHeight from './getBodyHeight';
import initialize from './initialize';
import useApiFunctions from '../apiFunctions/useApiFunctions';
import useMemoizedComponents from './useMemoizedComponents';
import useSelectedData from './useSelectedData';
import Modal from '../modal';
import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';

export default function App() {
  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // using a function in useState makes it's initializer only run once instead of on every cycle
  const [dateObject] = useState(() => getDateObject(6));
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [view, _setView] = useState<View>({ name: 'today' });
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

  const setView = (newView: View) => {
    if (newView.name === 'today' || newView.name === 'yesterday' || newView.name === 'selection') {
      setLatchedListView(newView);
    } else {
      setLatchedOccurrenceView(newView);
    }
    _setView(newView);
  };

  useEffect(() => {
    initialize(dateObject.today.dateString, {
      setView,
      setHabits,
      setOccurrenceData,
      setStreaks,
    });
  }, [dateObject]);

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
  } = useApiFunctions({
    dateObject,
    dayObject,
    latchedListView,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    selectedIndex,
    setSelectedIndex,
    setModalContentGenerator,
  });

  const components = useMemoizedComponents({
    selectedStreaks: selectedData.streaks,
    dayObject,
    latchedListView,
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
    deleteHabit,
    updateHabitCompleted,
    updateHabitVisibility,
  });

  const [minMarginHeight, setMinMarginHeight] = useState(100);
  const [maxListHeight, setMaxListHeight] = useState(2000);
  const [listRows, setListRows] = useState(10);
  const [occurrenceRows, setOccurrenceRows] = useState(27);

  if (!habits || !occurrenceData || !streaks) return null;

  /* eslint-disable jsx-a11y/label-has-associated-control */
  return (
    <>
      <div>
        <div
          style={{
            position: 'fixed',
            width: '200px',
            margin: '10px',
            top: '60px',
            zIndex: 99,
          }}
        >
          <label
            style={{
              position: 'absolute',
            }}
          >
            {`margin height: ${minMarginHeight} px`}
          </label>
          <input
            value={minMarginHeight}
            min={0}
            max={Math.floor((window.innerHeight - 300) / 2)}
            onChange={(e) => setMinMarginHeight(Number(e.target.value))}
            type="range"
            style={{
              width: '200px',
              padding: '0',
              margin: '0',
              position: 'absolute',
              top: '10px',
            }}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            width: '200px',
            margin: '10px',
            top: '60px',
            left: '210px',
            zIndex: 99,
          }}
        >
          <label
            style={{
              position: 'absolute',
            }}
          >
            {`max list height: ${maxListHeight} px`}
          </label>
          <input
            value={maxListHeight}
            min={150}
            max={2000}
            onChange={(e) => setMaxListHeight(Math.round(Number(e.target.value) / 50) * 50)}
            type="range"
            style={{
              width: '200px',
              padding: '0',
              margin: '0',
              position: 'absolute',
              top: '10px',
            }}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            width: '200px',
            margin: '10px',
            top: '110px',
            zIndex: 99,
          }}
        >
          <label
            style={{
              position: 'absolute',
            }}
          >
            list rows:
          </label>
          <input
            value={listRows}
            onChange={(e) => setListRows(Math.max(0, Math.min(28, Number(e.target.value))))}
            type="number"
            style={{
              border: '1px solid black',
              borderRadius: '5px',
              width: '50px',
              height: '25px',
              padding: '5px',
              margin: '0',
              position: 'absolute',
              left: '70px',
              top: '-5px',
            }}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            width: '200px',
            margin: '10px',
            top: '110px',
            left: '130px',
            zIndex: 99,
          }}
        >
          <label
            style={{
              position: 'absolute',
            }}
          >
            occurrence rows:
          </label>
          <input
            value={occurrenceRows}
            onChange={(e) => setOccurrenceRows(Math.max(0, Math.min(27, Number(e.target.value))))}
            type="number"
            style={{
              border: '1px solid black',
              borderRadius: '5px',
              width: '50px',
              height: '25px',
              padding: '5px',
              margin: '0',
              position: 'absolute',
              left: '130px',
              top: '-5px',
            }}
          />
        </div>
      </div>
      <Layout
        options={{
          minMarginHeight,
          maxListHeight,
        }}
        view={view}
        listRows={listRows}
        occurrenceRows={occurrenceRows}
      />
    </>
  );

  return (
    <>
      <Modal
        modalContentGenerator={modalContentGenerator}
        setModalContentGenerator={setModalContentGenerator}
      />
      <TransitionManager
        setInTransition={setInTransition}
        view={view}
        bodyHeight={getBodyHeight(view, habits, selectedData.occurrences)}
        occurrences={components.occurrences}
        days={components.days}
        dates={components.dates}
        list={components.list}
      />
    </>
  );
}
