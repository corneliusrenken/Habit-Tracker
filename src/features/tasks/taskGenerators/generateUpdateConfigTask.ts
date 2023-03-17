import Task from '../Task';

export default function generateUpdateConfigTask(
  updateData: Parameters<typeof window.electron['update-config']>[0],
): Task<'update-config'> {
  return {
    args: updateData,
    operation: (args) => window.electron['update-config'](args),
  };
}
