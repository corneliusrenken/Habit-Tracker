import TaskQueue from '../../../features/taskQueue';

let queue: TaskQueue;

const sleep = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

beforeEach(() => {
  queue = new TaskQueue();
});

test('enqueue adds a task to the queue and runs the task if no other tasks are currently running', () => {
  expect(queue.running).toBe(false);

  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: async () => {},
  });

  expect(queue.running).toBe(true);
});

test('you can subscribe to the onFinishedRunning event, which fires whenever all queued tasks are finished and running is set to false', async () => {
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  const mock3 = jest.fn();

  const op1 = async () => {
    await sleep(0);
    mock1();
  };
  const op2 = async () => {
    await sleep(0);
    mock2();
  };
  const op3 = async () => {
    await sleep(0);
    mock3();
  };

  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op1,
  });
  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op2,
  });
  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op3,
  });

  await new Promise((resolve) => {
    queue.onFinishedRunning.push(() => {
      expect(queue.running).toBe(false);
      expect(mock1).toBeCalledTimes(1);
      expect(mock2).toBeCalledTimes(1);
      expect(mock3).toBeCalledTimes(1);
      resolve('done');
    });
  });
});

test('when a task is finished, the queue runs the next task in the queue until no more tasks exist. This is done in the order that the tasks were added', async () => {
  const mock1 = jest.fn();
  const mock2 = jest.fn();
  const mock3 = jest.fn();

  const op1 = async () => {
    await sleep(0);
    mock1();
    expect(mock1).toBeCalledTimes(1);
    expect(mock2).toBeCalledTimes(0);
    expect(mock3).toBeCalledTimes(0);
  };
  const op2 = async () => {
    await sleep(0);
    mock2();
    expect(mock1).toBeCalledTimes(1);
    expect(mock2).toBeCalledTimes(1);
    expect(mock3).toBeCalledTimes(0);
  };
  const op3 = async () => {
    await sleep(0);
    mock3();
    expect(mock1).toBeCalledTimes(1);
    expect(mock2).toBeCalledTimes(1);
    expect(mock3).toBeCalledTimes(1);
  };

  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op1,
  });
  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op2,
  });
  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op3,
  });

  await new Promise((resolve) => { queue.onFinishedRunning.push(() => resolve('done')); });
});

test('the queue\'s tasks that are not currently running can be iterated over via the forEachWaitingTask method. They are iterated in the order that they were added in (oldest -> newest)', () => {
  const task1 = { args: { name: '1', date: 'unimportant' }, operation: async () => {} };
  const task2 = { args: { name: '2', date: 'unimportant' }, operation: async () => {} };
  const task3 = { args: { name: '3', date: 'unimportant' }, operation: async () => {} };
  const task4 = { args: { name: '4', date: 'unimportant' }, operation: async () => {} };

  queue.enqueue<'add-habit'>(task1);
  queue.enqueue<'add-habit'>(task2);
  queue.enqueue<'add-habit'>(task3);
  queue.enqueue<'add-habit'>(task4);

  const tasks: any[] = [];

  queue.forEachWaitingTask((task) => tasks.push(task));

  // task1 is not included because it is currently running
  expect(tasks).toEqual([task2, task3, task4]);
});

test('the arguments of a task are passed to the task\'s operation function', async () => {
  const mock1 = jest.fn();

  const op1 = async (...args: any[]) => {
    await sleep(0);
    mock1(...args);
  };

  queue.enqueue<'add-habit'>({
    args: { name: 'test', date: 'unimportant' },
    operation: op1,
  });

  await new Promise((resolve) => { queue.onFinishedRunning.push(() => resolve('done')); });

  expect(mock1).toBeCalledWith({ name: 'test', date: 'unimportant' });
});
