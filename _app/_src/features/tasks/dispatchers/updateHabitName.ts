import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { generateUpdateHabitTask } from '../taskGenerators';
import { updateHabitClient } from '../clientSideFunctions';

type States = {
  queue: TaskQueue;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function renameHabit(
  habitId: number,
  name: string,
  states: States,
) {
  updateHabitClient(habitId, { name }, states);
  states.queue.enqueue<'update-habit'>(generateUpdateHabitTask(habitId, { name }));
}
