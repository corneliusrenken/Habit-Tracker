import { useEffect, useRef } from 'react';
import {
  DateObject,
  Habit,
  OccurrenceData,
  Streaks,
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
};

function reInitialize({
  queue,
  setDateObject,
  setSelectedIndex,
  setHabits,
  setOccurrenceData,
  setStreaks,
}: {
  queue: TaskQueue;
  setDateObject: React.Dispatch<React.SetStateAction<DateObject>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
}) {
  if (!queue.running) {
    const newDateObject = getDateObject(6);
    setDateObject(newDateObject);
    initialize(newDateObject.today.dateString, {
      setSelectedIndex,
      setHabits,
      setOccurrenceData,
      setStreaks,
    });
  } else {
    console.log('waiting on queue finished');

    const onQueueFinishedRunning = () => {
      console.log(queue.onFinishedRunning);
      queue.onFinishedRunning.splice(queue.onFinishedRunning.indexOf(onQueueFinishedRunning), 1);

      const newDateObject = getDateObject(6);
      setDateObject(newDateObject);
      initialize(newDateObject.today.dateString, {
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
      });

      console.log(queue.onFinishedRunning);
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
}: States) {
  const firstRender = useRef(true);
  const waitingOnReorderingListOrInInput = useRef(false);

  useEffect(() => {
    if (waitingOnReorderingListOrInInput.current && !inInput && !reorderingList) {
      waitingOnReorderingListOrInInput.current = false;

      reInitialize({
        queue,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
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
  ]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      initialize(dateObject.today.dateString, {
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
      });
    }

    const cancelInterval = onDateChange(dateObject.today.dateString, () => {
      if (inInput || reorderingList) {
        waitingOnReorderingListOrInInput.current = true;
        return;
      }

      reInitialize({
        queue,
        setDateObject,
        setSelectedIndex,
        setHabits,
        setOccurrenceData,
        setStreaks,
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
  ]);
}
