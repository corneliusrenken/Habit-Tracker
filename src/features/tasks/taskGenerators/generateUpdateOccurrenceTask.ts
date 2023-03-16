import Task from '../Task';

/**
 * @param date YYYY-MM-DD
 */
export default function generateUpdateOccurrenceTask(
  habitId: number,
  date: string,
  updateData: Parameters<typeof window.electron['update-occurrence']>[0]['updateData'],
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
