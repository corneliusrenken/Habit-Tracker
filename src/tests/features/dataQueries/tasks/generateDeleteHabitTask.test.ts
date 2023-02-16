/**
 * @jest-environment jsdom
 */

import { generateDeleteHabitTask } from '../../../../features/dataQueries/tasks';

test('generates a task with the arguments needed by the \'delete-habit\' window function', () => {
  const habitId = 1;

  const task = generateDeleteHabitTask(habitId);

  expect(task.args).toEqual({
    habitId,
  });
});

test('the operation invokes the \'delete-habit\' window function', () => {
  window.electron = {
    ...window.electron,
    'delete-habit': jest.fn(),
  };

  const task = generateDeleteHabitTask(1);

  task.operation(task.args);

  expect(window.electron['delete-habit']).toHaveBeenCalledWith(task.args);
  expect(window.electron['delete-habit']).toHaveBeenCalledTimes(1);
});
