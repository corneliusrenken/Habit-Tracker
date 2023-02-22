import { useEffect, useRef } from 'react';
import {
  DateObject,
  Habit,
  OccurrenceData,
  Streaks,
  View,
} from '../../globalTypes';
import getDateObject from '../common/getDateObject';
import onDateChange from '../onDateChange/onDateChange';
import TaskQueue from '../taskQueue';
import initialize from './initialize';

type States = {
  queue: TaskQueue;
  dateObject: DateObject;
  inInput: boolean;
  reorderingList: boolean;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setView: (nextView: View | ((lastView: View) => View)) => void;
};

function initializeAfterQueueFinishedRunning({
  queue,
  setDateObject,
  setSelectedIndex,
  setHabits,
  setOccurrenceData,
  setStreaks,
  setView,
}: {
  queue: TaskQueue;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setView: (nextView: View | ((lastView: View) => View)) => void;
}) {
  if (!queue.running) {
    const newDateObject = getDateObject(6);
    setDateObject(newDateObject);
    initialize(newDateObject.today.dateString, {
      setSelectedIndex,
      setHabits,
      setOccurrenceData,
      setStreaks,
      setView,
    });
  } else {
    const onQueueFinishedRunning = () => {
      queue.onFinishedRunning.splice(
        queue.onFinishedRunning.indexOf(onQueueFinishedRunning),
        1,
      );

      const newDateObject = getDateObject(6);
      setDateObject(newDateObject);
      initialize(newDateObject.today.dateString, {
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    };

    queue.onFinishedRunning.push(onQueueFinishedRunning);
  }
}

export default function useDailyInitializer({
  queue,
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
  const firstRender = useRef(true);
  const waitingOnReorderingListOrInInput = useRef(false);

  useEffect(() => {
    if (waitingOnReorderingListOrInInput.current && !inInput && !reorderingList) {
      waitingOnReorderingListOrInInput.current = false;

      initializeAfterQueueFinishedRunning({
        queue,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }
  }, [
    inInput,
    queue,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      initialize(dateObject.today.dateString, {
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
        setView,
      });
    }

    const cancelInterval = onDateChange(dateObject.today.dateString, () => {
      if (inInput || reorderingList) {
        waitingOnReorderingListOrInInput.current = true;
        return;
      }

      initializeAfterQueueFinishedRunning({
        queue,
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
    dateObject.today.dateString,
    inInput,
    queue,
    reorderingList,
    setDateObject,
    setHabits,
    setOccurrenceData,
    setSelectedIndex,
    setStreaks,
    setView,
  ]);
}
