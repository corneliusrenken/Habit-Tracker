/**
 * @jest-environment jsdom
 */

import { generateUpdateOccurrenceTask } from '../../../../features/tasks/taskGenerators';

test('generates a task with the arguments needed by the \'update-occurrence\' window function', () => {
  const habitId = 1;
  const date = '2023-02-16';
  const updateData = { visible: false };

  const task = generateUpdateOccurrenceTask(habitId, date, updateData);

  expect(task.args).toEqual({
    habitId,
    date,
    updateData,
  });
});

test('the operation invokes the \'update-occurrence\' window function', () => {
  window.electron = {
    ...window.electron,
    'update-occurrence': jest.fn(),
  };

  const task = generateUpdateOccurrenceTask(1, '2023-02-16', { visible: false });

  task.operation(task.args);

  expect(window.electron['update-occurrence']).toHaveBeenCalledWith(task.args);
  expect(window.electron['update-occurrence']).toHaveBeenCalledTimes(1);
});
