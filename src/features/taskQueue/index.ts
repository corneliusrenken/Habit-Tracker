import DoublyLinkedList from './DoublyLinkedList';

type TaskTypes = keyof typeof window.electron;

type TaskArguments = {
  [type in TaskTypes]: Parameters<typeof window.electron[type]>[0];
};

export type Task<TaskType extends TaskTypes> = {
  args: TaskArguments[TaskType]
  operation: (args: TaskArguments[TaskType]) => Promise<void>;
};

export default class TaskQueue {
  #queue = new DoublyLinkedList<Task<any>>();
  running = false;
  onFinishedRunning: (() => void)[] = [];

  enqueue<TaskType extends TaskTypes>(task: Task<TaskType>) {
    this.#queue.unshift(task);

    if (!this.running) {
      this.#run();
    }
  }

  async #run() {
    const task = this.#queue.pop();

    if (!task) throw new Error('trying to run a task but no more tasks exist');

    this.running = true;

    await task.operation(task.args);

    if (this.#queue.size) {
      this.#run();
    } else {
      this.running = false;
      this.onFinishedRunning.forEach((callback) => callback());
    }
  }

  forEachWaitingTask(callback: (task: Task<any>) => void) {
    let current = this.#queue.head;
    while (current) {
      callback(current.value);
      current = current.prev;
    }
  }
}
