import { Task } from '../../taskQueue';

export default function generateUpdateHabitTask(
  habitId: number,
  updateData: Task<'update-habit'>['args']['updateData'],
): Task<'update-habit'> {
  return {
    args: {
      habitId,
      updateData,
    },
    operation: (args) => window.electron['update-habit'](args),
  };
}
