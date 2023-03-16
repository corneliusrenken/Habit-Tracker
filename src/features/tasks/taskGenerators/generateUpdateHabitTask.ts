import Task from '../Task';

export default function generateUpdateHabitTask(
  habitId: number,
  updateData: Parameters<typeof window.electron['update-habit']>[0]['updateData'],
): Task<'update-habit'> {
  return {
    args: {
      habitId,
      updateData,
    },
    operation: (args) => window.electron['update-habit'](args),
  };
}
