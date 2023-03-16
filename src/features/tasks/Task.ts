type TaskParameters = {
  // 'update-config': { updateData: Parameters<typeof window.electron['update-config']>[0] };
  'update-config': Parameters<typeof window.electron['update-config']>[0];
  'add-habit': Parameters<typeof window.electron['add-habit']>[0];
  'add-occurrence': Parameters<typeof window.electron['add-occurrence']>[0];
  'delete-habit': Parameters<typeof window.electron['delete-habit']>[0];
  'delete-occurrence': Parameters<typeof window.electron['delete-occurrence']>[0];
  'update-habit': Parameters<typeof window.electron['update-habit']>[0];
  'update-occurrence': Parameters<typeof window.electron['update-occurrence']>[0];
};

export type TaskTypes = keyof TaskParameters;

type Task<TaskType extends TaskTypes> = {
  args: TaskParameters[TaskType];
  operation: (args: TaskParameters[TaskType]) => Promise<void>;
};

export default Task;
