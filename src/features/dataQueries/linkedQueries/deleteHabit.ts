import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { generateDeleteHabitTask } from '../tasks';
import { deleteHabitStateUpdate } from '../stateUpdaters';

type States = {
  queue: TaskQueue;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function deleteHabit(
  habitId: number,
  states: States,
) {
  deleteHabitStateUpdate(habitId, states);
  states.queue.enqueue<'delete-habit'>(generateDeleteHabitTask(habitId));
}
