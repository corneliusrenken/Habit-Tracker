import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Habit,
  ModalGenerator,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import Modal from '../modal';
import useShortcutManager from '../shortcutManager/useShortcutManager';
import Layout from '../layout';
import useTaskDispatchers from '../tasks/useTaskDispatchers';
import useSetLeftAndRightDateMargins from './useSetLeftAndRightDateMargins';
import TaskQueue from '../taskQueue';
import getDateObject from '../common/getDateObject';
import useDailyInitializer from './useDailyInitializer';
import Occurrences from '../occurrences';
import Days from '../days';
import Dates from '../dates';
import List from '../list';
import useSelectedData from '../selectedData/useSelectedData';
import scrollSelectedIndexIntoView from './scrollSelectedIndexIntoView';
import { Config } from '../../api/config/defaultConfig';
import ConfigContext from '../initializer/ConfigContext';
import Icon from '../icon';
import createSettingsModalGenerator from '../settingsModal';

type Props = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

const taskQueue = new TaskQueue();

export default function App({ setConfig }: Props) {
  const { startWeekOn } = useContext(ConfigContext);
  const queue = useRef(taskQueue);
  const [dateObject, setDateObject] = useState(() => getDateObject(startWeekOn));
  const [view, setView] = useState<View>(() => ({ name: 'today' }));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [inInput, setInInput] = useState(false);
  const [reorderingList, setReorderingList] = useState(false);
  const [inTransition, setInTransition] = useState(false);
  const [modal, setModal] = useState<ModalGenerator | undefined>(undefined);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [occurrenceData, setOccurrenceData] = useState<OccurrenceData>({ dates: {}, oldest: {} });
  const [streaks, setStreaks] = useState<Streaks>({});
  const [ignoreMouse, setIgnoreMouse] = useState(true);

  const layoutOptions = useRef({
    minMarginHeight: 50,
    maxListHeight: 600,
  });

  useEffect(() => {
    if (selectedIndex !== null) scrollSelectedIndexIntoView(selectedIndex);
  }, [selectedIndex]);

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
    updateConfig,
  } = useTaskDispatchers({
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
    setConfig,
  });

  const {
    selectedHabits,
    selectedOccurrences,
    selectedStreaks,
  } = useSelectedData({
    view,
    dateObject,
    occurrenceData,
    habits,
    streaks,
  });

  useShortcutManager({
    setIgnoreMouse,
    dateObject,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setSelectedIndex,
    reorderingList,
    modal,
    setModal,
    deleteHabit,
    updateOccurrenceCompleted,
    updateOccurrenceVisibility,
    updateHabitListPosition,
    updateConfig,
  });

  if (occurrenceData.dates[dateObject.today.dateString] === undefined) return null;

  return (
    <>
      <Modal
        modal={modal}
        setModal={setModal}
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
            selectedOccurrences={selectedOccurrences}
          />
        )}
        days={(
          <Days
            view={view}
            dateObject={dateObject}
            selectedOccurrences={selectedOccurrences}
          />
        )}
        dates={(
          <Dates
            view={view}
            dateObject={dateObject}
            selectedOccurrences={selectedOccurrences}
          />
        )}
        list={(
          <List
            ignoreMouse={ignoreMouse}
            disableTabIndex={modal !== undefined}
            dateObject={dateObject}
            view={view}
            selectedHabits={selectedHabits}
            selectedStreaks={selectedStreaks}
            occurrenceData={occurrenceData}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            inInput={inInput}
            setInInput={setInInput}
            reorderingList={reorderingList}
            setReorderingList={setReorderingList}
            setModal={setModal}
            addHabit={addHabit}
            deleteHabit={deleteHabit}
            updateHabitListPosition={updateHabitListPosition}
            updateHabitName={updateHabitName}
            updateOccurrenceCompleted={updateOccurrenceCompleted}
            updateOccurrenceVisibility={updateOccurrenceVisibility}
          />
        )}
        settingsButton={(
          <button
            type="button"
            className="settings-button"
            tabIndex={modal !== undefined ? -1 : undefined}
            onClick={() => {
              const modalGenerator = createSettingsModalGenerator({ updateConfig });
              setModal(() => modalGenerator);
            }}
          >
            <Icon
              icon="gear"
            />
          </button>
        )}
      />
    </>
  );
}
