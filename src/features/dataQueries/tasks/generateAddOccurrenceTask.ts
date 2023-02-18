import { Task } from '../../taskQueue';

/**
 * @param date YYYY-MM-DD
 */
export default function generateAddOccurrenceTask(
  habitId: number,
  date: string,
): Task<'add-occurrence'> {
  return {
    args: {
      habitId,
      date,
    },
    operation: (args) => window.electron['add-occurrence'](args),
  };
}
