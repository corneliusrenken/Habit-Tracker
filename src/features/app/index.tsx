import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Habit,
  ModalContentGenerator,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import Modal from '../modal';
// import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';
import useDataQueries from '../dataQueries/useDataQueries';
import useSetLeftAndRightDateMargins from './useSetLeftAndRightDateMargins';
import TaskQueue from '../taskQueue';
import getDateObject from '../common/getDateObject';
import useDailyInitializer from './useDailyInitializer';
import Occurrences from '../occurrences';
import Days from '../days';
import Dates from '../dates';
import List from '../list';
import getSelectedHabits from '../selectedData/getSelectedHabits';
import getSelectedOccurrences from '../selectedData/getSelectedOccurrences';

export default function App() {
  const queue = useRef(new TaskQueue());
  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // using a function in useState makes it's initializer only run once instead of on every cycle
  const [dateObject, setDateObject] = useState(() => getDateObject(6));
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [view, _setView] = useState<View>(() => ({ name: 'today' }));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [inInput, setInInput] = useState(false);
  const [reorderingList, setReorderingList] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  // eslint-disable-next-line max-len
  const [modalContentGenerator, setModalContentGenerator] = useState<ModalContentGenerator | undefined>(undefined);
  const [habits, setHabits] = useState<Habit[]>();
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>();
  const [streaks, setStreaks] = useState<Streaks>();
  const [ignoreMouse, setIgnoreMouse] = useState(true);
  const layoutOptions = useRef({
    minMarginHeight: 50,
    maxListHeight: 600,
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (ignoreMouse) {
      const onMouseMove = (e: MouseEvent) => {
        setIgnoreMouse(false);
        window.removeEventListener('mousemove', onMouseMove);
        setTimeout(() => {
          const elementAtMousePosition = document.elementFromPoint(e.clientX, e.clientY);
          if (elementAtMousePosition) {
            elementAtMousePosition.dispatchEvent(new MouseEvent('mouseover', {
              view: window,
              bubbles: true,
              cancelable: true,
            }));
          }
        }, 0);
      };

      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }
  }, [ignoreMouse]);

  // development only
  // development only
  // development only
  if (!inInput && selectedIndex === habits?.length) {
    throw new Error('should always be in input when selected index is equal to habits length');
  }

  const setView = useCallback((nextView: View | ((lastView: View) => View)) => {
    if (nextView instanceof Function) {
      nextView = nextView(view); // eslint-disable-line no-param-reassign
    }

    if (
      (nextView.name !== view.name)
      || (nextView.name === 'focus' && view.name === 'focus' && nextView.focusId !== view.focusId)
    ) {
      _setView(nextView);
    }
  }, [view]);

  useDailyInitializer({
    queue: queue.current,
    dateObject,
    inInput,
    reorderingList,
    setDateObject,
    setSelectedIndex,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setView,
  });

  useSetLeftAndRightDateMargins({ view, dateObject });

  const {
    addHabit,
    deleteHabit,
    updateHabitListPosition,
    updateHabitName,
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
  } = useDataQueries({
    queue: queue.current,
    dateObject,
    view,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    setSelectedIndex,
    setInInput,
  });

  // temp
  // temp
  // temp
  const selectedHabits = getSelectedHabits({
    habits,
    listView: view.name === 'yesterday' ? { name: 'yesterday' } : { name: 'today' },
    dateObject,
    occurrenceData,
  });
  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData,
    dateObject,
    view,
  });

  // useShortcutManager({
  //   modalContentGenerator,
  //   setIgnoreMouse,
  //   dateObject,
  //   latchedListView: view.name === 'yesterday' ? { name: 'yesterday' } : { name: 'today' },
  //   habits,
  //   inInput,
  //   inTransition,
  //   occurrenceData,
  //   selectedHabits,
  //   selectedIndex,
  //   view,
  //   setInInput,
  //   setView,
  //   setSelectedIndex,
  //   reorderingList,
  //   setModalContentGenerator,
  //   deleteHabit,
  //   updateOccurrenceCompleted,
  //   updateOccurrenceVisibility,
  //   updateHabitListPosition,
  // });

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
        listRows={view.name === 'selection' ? selectedHabits.length + 1 : selectedHabits.length}
        occurrenceRows={Math.ceil((selectedOccurrences.length - 7) / 7)}
        setInTransition={setInTransition}
        occurrences={(
          <Occurrences
            view={view}
            dateObject={dateObject}
            occurrenceData={occurrenceData}
          />
        )}
        days={(
          <Days
            view={view}
            dateObject={dateObject}
            occurrenceData={occurrenceData}
          />
        )}
        dates={(
          <Dates
            view={view}
            dateObject={dateObject}
            occurrenceData={occurrenceData}
          />
        )}
        list={(
          <List
            ignoreMouse={ignoreMouse}
            ignoreTabIndices={modalContentGenerator !== undefined}
            dateObject={dateObject}
            view={view}
            habits={habits}
            streaks={streaks}
            occurrenceData={occurrenceData}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            inInput={inInput}
            setInInput={setInInput}
            reorderingList={reorderingList}
            setReorderingList={setReorderingList}
            setModalContentGenerator={setModalContentGenerator}
            addHabit={addHabit}
            deleteHabit={deleteHabit}
            updateHabitListPosition={updateHabitListPosition}
            updateHabitName={updateHabitName}
            updateOccurrenceCompleted={updateOccurrenceCompleted}
            updateOccurrenceVisibility={updateOccurrenceVisibility}
          />
        )}
      />
    </>
  );
}
