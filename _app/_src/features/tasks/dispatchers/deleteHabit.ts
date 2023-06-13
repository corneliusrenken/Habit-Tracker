import TaskQueue from '../../taskQueue';
import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { generateDeleteHabitTask } from '../taskGenerators';
import { deleteHabitClient } from '../clientSideFunctions';

type States = {
  queue: TaskQueue;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function deleteHabit(
  habitId: number,
  states: States,
) {
  deleteHabitClient(habitId, states);
  states.queue.enqueue<'delete-habit'>(generateDeleteHabitTask(habitId));
}
