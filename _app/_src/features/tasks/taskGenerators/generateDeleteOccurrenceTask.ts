import Task from '../Task';

/**
 * @param date YYYY-MM-DD
 */
export default function generateDeleteOccurrenceTask(
  habitId: number,
  date: string,
): Task<'delete-occurrence'> {
  return {
    args: {
      habitId,
      date,
    },
    operation: (args) => window.electron['delete-occurrence'](args),
  };
}
