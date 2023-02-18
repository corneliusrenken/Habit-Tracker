/* eslint-disable no-lonely-if */
import TaskQueue from '../../taskQueue';
import { OccurrenceData, Streaks } from '../../../globalTypes';
import {
  generateAddOccurrenceTask,
  generateUpdateOccurrenceTask,
  generateDeleteOccurrenceTask,
} from '../tasks';
import {
  addOccurrenceStateUpdate,
  deleteOccurrenceStateUpdate,
  updateOccurrenceStateUpdate,
} from '../stateUpdaters';

type States = {
  queue: TaskQueue;
  streaks: Streaks | undefined;
  occurrenceData: OccurrenceData | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

/**
 * @param occurrenceDate YYYY-MM-DD
 * @param currentDate YYYY-MM-DD
 */
export default function updateOccurrenceVisibility(
  habitId: number,
  visible: boolean,
  occurrenceDate: string,
  currentDate: string,
  states: States,
) {
  const {
    queue, streaks, occurrenceData,
  } = states;

  if (!streaks || !occurrenceData) throw new Error('states should not be undefined');

  const occurrencesToday = { ...occurrenceData.dates[occurrenceDate] };

  if (occurrencesToday === undefined) throw new Error('no day entry exists for the given date');

  const habitOccurrenceToday = occurrencesToday[habitId];

  if (visible) {
    if (habitOccurrenceToday === undefined) {
      addOccurrenceStateUpdate(habitId, occurrenceDate, states);
      queue.enqueue<'add-occurrence'>(generateAddOccurrenceTask(habitId, currentDate));
    } else {
      updateOccurrenceStateUpdate(habitId, occurrenceDate, currentDate, { visible }, states);
      queue.enqueue<'update-occurrence'>(generateUpdateOccurrenceTask(habitId, currentDate, { visible }));
    }
  } else {
    if (habitOccurrenceToday === undefined) {
      throw new Error('occurrence doesn\'t exist on the given date');
    } else if (habitOccurrenceToday.complete) {
      updateOccurrenceStateUpdate(habitId, occurrenceDate, currentDate, { visible }, states);
      queue.enqueue<'update-occurrence'>(generateUpdateOccurrenceTask(habitId, currentDate, { visible }));
    } else {
      deleteOccurrenceStateUpdate(habitId, occurrenceDate, currentDate, states);
      queue.enqueue<'delete-occurrence'>(generateDeleteOccurrenceTask(habitId, currentDate));
    }
  }
}
