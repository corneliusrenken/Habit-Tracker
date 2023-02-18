import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { addHabitStateUpdate } from '../stateUpdaters';
import { generateAddHabitTask } from '../tasks';

type States = {
  queue: TaskQueue;
  habits: Habit[] | undefined;
  streaks: Streaks | undefined;
  occurrenceData: OccurrenceData | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
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
  addHabitStateUpdate(tempId, name, date, states);
  states.queue.enqueue<'add-habit'>(generateAddHabitTask(tempId, name, date, states));
}
