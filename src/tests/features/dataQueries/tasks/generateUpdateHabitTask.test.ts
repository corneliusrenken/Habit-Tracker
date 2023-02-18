/**
 * @jest-environment jsdom
 */

import { generateUpdateHabitTask } from '../../../../features/dataQueries/tasks';

test('generates a task with the arguments needed by the \'update-habit\' window function', () => {
  const habitId = 1;
  const updateData = { name: 'new name' };

  const task = generateUpdateHabitTask(habitId, updateData);

  expect(task.args).toEqual({
    habitId,
    updateData,
  });
});

test('the operation invokes the \'update-habit\' window function', () => {
  window.electron = {
    ...window.electron,
    'update-habit': jest.fn(),
  };

  const task = generateUpdateHabitTask(1, { name: 'new name' });

  task.operation(task.args);

  expect(window.electron['update-habit']).toHaveBeenCalledWith(task.args);
  expect(window.electron['update-habit']).toHaveBeenCalledTimes(1);
});
