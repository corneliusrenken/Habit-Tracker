import React, {
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Habit,
  ListView,
  ModalContentGenerator,
  OccurrenceData,
  OccurrenceView,
  Streaks,
  View,
} from '../../globalTypes';
import useMemoizedComponents from './useMemoizedComponents';
import Modal from '../modal';
import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';
import useDataQueries from '../dataQueries/useDataQueries';
import useSetLeftAndRightDateMargins from './useSetLeftAndRightDateMargins';
import useSelectedData from '../selectedData/useSelectedData';
import TaskQueue from '../taskQueue';
import getDateObject from '../common/getDateObject';
import useDailyInitializer from './useDailyInitializer';

export default function App() {
  const queue = useRef(new TaskQueue());
  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  // using a function in useState makes it's initializer only run once instead of on every cycle
  const [dateObject, setDateObject] = useState(() => getDateObject(6));
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

  const setView = useCallback((nextView: View | ((lastView: View) => View)) => {
    if (nextView instanceof Function) {
      nextView = nextView(view); // eslint-disable-line no-param-reassign
    }

    if (nextView.name !== view.name) {
      if (nextView.name === 'today' || nextView.name === 'yesterday' || nextView.name === 'selection') {
        setLatchedListView(nextView);
      } else {
        setLatchedOccurrenceView(nextView);
      }
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
  });

  const selectedData = useSelectedData({
    dateObject,
    habits,
    occurrenceData,
    streaks,
    latchedListView,
    view,
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

  const components = useMemoizedComponents({
    selectedStreaks: selectedData.streaks,
    dateObject,
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
    setModalContentGenerator,
    addHabit,
    deleteHabit,
    updateHabitListPosition,
    updateHabitName,
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
  });

  useShortcutManager({
    dateObject,
    latchedListView,
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
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
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
