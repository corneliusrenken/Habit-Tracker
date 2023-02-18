import { Task } from '../../taskQueue';

export default function generateDeleteHabitTask(
  habitId: number,
): Task<'delete-habit'> {
  return {
    args: {
      habitId,
    },
    operation: (args) => window.electron['delete-habit'](args),
  };
}
