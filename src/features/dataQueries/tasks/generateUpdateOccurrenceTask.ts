import { Task } from '../../taskQueue';

/**
 * @param date YYYY-MM-DD
 */
export default function generateUpdateOccurrenceTask(
  habitId: number,
  date: string,
  updateData: Task<'update-occurrence'>['args']['updateData'],
): Task<'update-occurrence'> {
  return {
    args: {
      habitId,
      date,
      updateData,
    },
    operation: (args) => window.electron['update-occurrence'](args),
  };
}
