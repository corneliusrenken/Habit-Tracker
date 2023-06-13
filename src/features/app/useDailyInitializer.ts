import { useContext, useEffect, useRef } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  Config,
  DateObject,
  Habit,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import getDateObject from '../common/getDateObject';
import ConfigContext from '../configLoader/ConfigContext';
import onDateChange from '../onDateChange/onDateChange';
import initialize from './initialize';

type States = {
  dateObject: DateObject;
  inInput: boolean;
  reorderingList: boolean;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
};

function initializeAfterQueueFinishedRunning({
  startWeekOn,
  showBoundary,
  setDateObject,
  setSelectedIndex,
  setHabits,
  setOccurrenceData,
  setStreaks,
  setView,
}: {
  startWeekOn: Config['startWeekOn'];
  showBoundary: (error: any) => void;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
}) {
  const newDateObject = getDateObject(startWeekOn);
  setDateObject(newDateObject);
  initialize(newDateObject.today.dateString, {
    showBoundary,
    setSelectedIndex,
    setHabits,
    setOccurrenceData,
    setStreaks,
    setView,
  });
}

export default function useDailyInitializer({
  dateObject,
  inInput,
  reorderingList,
  setDateObject,
  setSelectedIndex,
  setHabits,
  setOccurrenceData,
  setStreaks,
  setView,
}: States) {
  const { showBoundary } = useErrorBoundary();
  const { startWeekOn } = useContext(ConfigContext);

  const lastUsedStartWeekOn = useRef(startWeekOn);
  const firstRender = useRef(true);
  const waitingOnReorderingListOrInInput = useRef(false);

  // initialize after user is no longer in input or reordering list
  useEffect(() => {
    if (waitingOnReorderingListOrInInput.current && !inInput && !reorderingList) {
      waitingOnReorderingListOrInInput.current = false;

      initializeAfterQueueFinishedRunning({
        startWeekOn,
        showBoundary,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    showBoundary,
    inInput,
    startWeekOn,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  // initialize after start week on property in config changes
  useEffect(() => {
    if (startWeekOn !== lastUsedStartWeekOn.current) {
      lastUsedStartWeekOn.current = startWeekOn;

      if (inInput || reorderingList) {
        waitingOnReorderingListOrInInput.current = true;
        return;
      }

      initializeAfterQueueFinishedRunning({
        startWeekOn,
        showBoundary,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    showBoundary,
    inInput,
    startWeekOn,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  // initialize on first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      initialize(dateObject.today.dateString, {
        showBoundary,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    showBoundary,
    dateObject.today.dateString,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  // initialize on date change
  useEffect(() => {
    const cancelInterval = onDateChange(dateObject.today.dateString, () => {
      if (inInput || reorderingList) {
        waitingOnReorderingListOrInInput.current = true;
        return;
      }

      initializeAfterQueueFinishedRunning({
        startWeekOn,
        showBoundary,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    });

    return cancelInterval;
  }, [
    showBoundary,
    dateObject.today.dateString,
    inInput,
    startWeekOn,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);
}
