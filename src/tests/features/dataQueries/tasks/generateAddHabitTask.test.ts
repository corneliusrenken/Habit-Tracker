/**
 * @jest-environment jsdom
 */

import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import { generateAddHabitTask, generateUpdateHabitTask } from '../../../../features/dataQueries/tasks';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import TaskQueue from '../../../../features/taskQueue';

let queue: TaskQueue;
let habitState: PseudoUseState<Habit[]>;
let streaksState: PseudoUseState<Streaks>;
let occurrenceDataState: PseudoUseState<OccurrenceData>;
let selectedIndexState: PseudoUseState<number | null>;

beforeEach(() => {
  window.electron = {
    ...window.electron,
    'add-habit': jest.fn(async ({ name }) => ({ id: 999, name })),
  };

  queue = new TaskQueue();

  habitState = new PseudoUseState<Habit[]>([
    { id: 1, name: 'exercise' },
  ]);

  streaksState = new PseudoUseState<Streaks>({
    1: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: {
      1: '2023-02-10',
    },
    dates: {
      '2023-02-10': {
        1: { complete: false, visible: true },
      },
    },
  });

  selectedIndexState = new PseudoUseState<number | null>(0);
});

test('generates a task with the arguments needed by the \'add-habit\' window function', () => {
  const tempId = 1234;
  const name = 'new habit';
  const date = '2023-02-16';

  const task = generateAddHabitTask(tempId, name, date, {
    queue,
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
  });

  expect(task.args).toEqual({
    name,
    date,
  });
});

test('the operation invokes the \'add-habit\' window function', () => {
  const task = generateAddHabitTask(1234, 'new habit', '2023-02-16', {
    queue,
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
  });

  // simulate the state being updated before the task is executed
  habitState.setState((previousHabits) => [...previousHabits || [], { id: 1234, name: 'new habit' }]);

  task.operation(task.args);

  expect(window.electron['add-habit']).toHaveBeenCalledWith(task.args);
  expect(window.electron['add-habit']).toHaveBeenCalledTimes(1);
});

test('the operation updates all states so that the temporary habit id is replaced with the one returned by the database', async () => {
  // simulate the state being updated before the task is executed
  habitState.setState((previousHabits) => [...(previousHabits || []), { id: 1234, name: 'new habit' }]);
  streaksState.setState((previousStreaks) => (
    { ...(previousStreaks || {}), 1234: { current: 0, maximum: 0 } }
  ));
  occurrenceDataState.setState((previousOccurrenceData) => ({
    oldest: {
      ...previousOccurrenceData?.oldest,
      1234: '2023-02-16',
    },
    dates: {
      ...previousOccurrenceData?.dates,
      '2023-02-16': {
        1234: { complete: false, visible: true },
      },
    },
  }));

  queue.enqueue(generateAddHabitTask(1234, 'new habit', '2023-02-16', {
    queue,
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
  }));

  await new Promise((resolve) => { queue.onFinishedRunning.push(() => resolve('done')); });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise' },
    { id: 999, name: 'new habit' }, // id returned by mock function as defined in beforeEach
  ]);
  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
    999: { current: 0, maximum: 0 },
  });
  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: '2023-02-10',
      999: '2023-02-16',
    },
    dates: {
      '2023-02-10': { 1: { complete: false, visible: true } },
      '2023-02-16': { 999: { complete: false, visible: true } },
    },
  });
});

test('the operation edits all other tasks which contain the temporary id as a \'habitId\' argument, so that the argument now reflects the id returned by the database', async () => {
  window.electron = {
    ...window.electron,
    'add-habit': jest.fn(async ({ name }) => ({ id: 999, name })),
    'update-habit': jest.fn(),
  };

  habitState.setState((previousHabits) => [...(previousHabits || []), { id: 1234, name: 'new habit' }]);

  queue.enqueue(generateAddHabitTask(1234, 'new habit', '2023-02-16', {
    queue,
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
  }));

  queue.enqueue(generateUpdateHabitTask(1234, { name: 'updated name' }));

  await new Promise((resolve) => { queue.onFinishedRunning.push(() => resolve('done')); });

  expect(window.electron['update-habit']).not.toHaveBeenCalledWith({ habitId: 1234, updateData: { name: 'updated name' } });
  expect(window.electron['update-habit']).toHaveBeenCalledWith({ habitId: 999, updateData: { name: 'updated name' } });
});
