import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { addHabitClient } from '../clientSideFunctions';
import { generateAddHabitTask } from '../taskGenerators';

type States = {
  queue: TaskQueue;
  habits: Habit[];
  streaks: Streaks;
  occurrenceData: OccurrenceData;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

/**
 * @param date YYYY-MM-DD
 */
export default function addHabit(
  name: string,
  date: string,
  states: States,
) {
  const tempId = -new Date().getTime();
  addHabitClient(tempId, name, date, states);
  states.queue.enqueue<'add-habit'>(generateAddHabitTask(tempId, name, date, states));
}
