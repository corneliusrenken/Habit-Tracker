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
  occurrenceData: OccurrenceData;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
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
    queue, occurrenceData,
  } = states;
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
