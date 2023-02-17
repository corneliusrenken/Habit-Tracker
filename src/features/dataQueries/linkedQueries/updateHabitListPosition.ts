import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { generateUpdateHabitTask } from '../tasks';
import { updateHabitStateUpdate } from '../stateUpdaters';

type States = {
  queue: TaskQueue;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function updateHabitListPosition(
  habitId: number,
  listPosition: number,
  states: States,
) {
  updateHabitStateUpdate(habitId, { listPosition }, states);
  states.queue.enqueue<'update-habit'>(generateUpdateHabitTask(habitId, { listPosition }));
}
