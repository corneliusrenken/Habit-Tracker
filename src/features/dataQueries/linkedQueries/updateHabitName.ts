import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { generateUpdateHabitTask } from '../tasks';
import { updateHabitStateUpdate } from '../stateUpdaters';

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
  updateHabitStateUpdate(habitId, { name }, states);
  states.queue.enqueue<'update-habit'>(generateUpdateHabitTask(habitId, { name }));
}
