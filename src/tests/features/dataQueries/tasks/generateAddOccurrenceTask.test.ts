/**
 * @jest-environment jsdom
 */

import { generateAddOccurrenceTask } from '../../../../features/dataQueries/tasks';

test('generates a task with the arguments needed by the \'add-occurrence\' window function', () => {
  const habitId = 1;
  const date = '2023-02-16';

  const task = generateAddOccurrenceTask(habitId, date);

  expect(task.args).toEqual({
    habitId,
    date,
  });
});

test('the operation invokes the \'add-occurrence\' window function', () => {
  window.electron = {
    ...window.electron,
    'add-occurrence': jest.fn(),
  };

  const task = generateAddOccurrenceTask(1, '2023-02-16');

  task.operation(task.args);

  expect(window.electron['add-occurrence']).toHaveBeenCalledWith(task.args);
  expect(window.electron['add-occurrence']).toHaveBeenCalledTimes(1);
});
