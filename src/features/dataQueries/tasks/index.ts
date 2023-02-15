// type Params = {
//   name: string;
//   date: string;
// };

type AddHabitTask = {
  args: Parameters<typeof window.electron['add-habit']>[0];
  operation: (args: AddHabitTask['args']) => Promise<void>;
};

type DeleteHabitTask = {
  args: {
    habitId: number;
    name: string;
  };
  operation: (args: DeleteHabitTask['args']) => Promise<void>;
};

const task1: AddHabitTask = {
  args: {
    name: 'Test Habit',
    date: '2021-01-01',
  },
  operation: async (args) => {
    await window.electron['add-habit'](args);
    console.log('Habit added!');
  },
};

const task2: DeleteHabitTask = {
  args: {
    habitId: 1,
    name: 'Test Habit',
  },
  operation: async (args) => {
    await window.electron['delete-habit'](args);
    console.log('Habit deleted!');
  },
};

const tasks: (AddHabitTask | DeleteHabitTask)[] = [task1, task2];

tasks.forEach((task) => {
  const { args } = task;

  args.date;
});