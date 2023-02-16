import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import TaskQueue, { Task } from '../../taskQueue';
import { updateHabitStateUpdate } from '../stateUpdaters';

type States = {
  queue: TaskQueue;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
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
        if (task.args.habitId === tempId) {
          task.args.habitId = addedHabit.id; // eslint-disable-line no-param-reassign
        }
      });

      updateHabitStateUpdate(tempId, { id: addedHabit.id }, states);
    },
  };
}
