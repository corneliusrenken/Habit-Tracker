/**
 * @jest-environment jsdom
 */

import { generateDeleteOccurrenceTask } from '../../../../features/dataQueries/tasks';

test('generates a task with the arguments needed by the \'delete-occurrence\' window function', () => {
  const habitId = 1;
  const date = '2023-02-16';

  const task = generateDeleteOccurrenceTask(habitId, date);

  expect(task.args).toEqual({
    habitId,
    date,
  });
});

test('the operation invokes the \'delete-occurrence\' window function', () => {
  window.electron = {
    ...window.electron,
    'delete-occurrence': jest.fn(),
  };

  const task = generateDeleteOccurrenceTask(1, '2023-02-16');

  task.operation(task.args);

  expect(window.electron['delete-occurrence']).toHaveBeenCalledWith(task.args);
  expect(window.electron['delete-occurrence']).toHaveBeenCalledTimes(1);
});
