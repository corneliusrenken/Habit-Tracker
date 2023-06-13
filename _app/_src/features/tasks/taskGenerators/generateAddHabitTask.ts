import TaskQueue from '../../taskQueue';
import {
  Habit,
  OccurrenceData,
  Streaks,
} from '../../../globalTypes';
import { updateHabitClient } from '../clientSideFunctions';
import Task from '../Task';

type States = {
  queue: TaskQueue;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

/**
 * @param date YYYY-MM-DD
 */
export default function generateAddHabitTask(
  tempId: number,
  name: string,
  date: string,
  states: States,
): Task<'add-habit'> {
  return {
    args: {
      name,
      date,
    },
    operation: async (args) => {
      const addedHabit = await window.electron['add-habit'](args);

      states.queue.forEachWaitingTask((task) => {
        if ('habitId' in task.args && task.args.habitId === tempId) {
          task.args.habitId = addedHabit.id; // eslint-disable-line no-param-reassign
        }
      });

      updateHabitClient(tempId, { id: addedHabit.id }, states);
    },
  };
}
