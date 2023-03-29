import LinkedList from './LinkedList';
import Task, { TaskTypes } from '../tasks/Task';

export default class TaskQueue {
  #queue = new LinkedList<Task<any>>();
  running = false;
  onFinishedRunning: (() => void)[] = [];
  showErrorBoundery: ((error: Error) => void);

  constructor(showErrorBoundery: ((error: Error) => void)) {
    this.showErrorBoundery = showErrorBoundery;
  }

  enqueue<TaskType extends TaskTypes>(task: Task<TaskType>) {
    this.#queue.push(task);

    if (!this.running) {
      this.#run();
    }
  }

  async #run() {
    const task = this.#queue.shift();

    if (!task) throw new Error('trying to run a task but no more tasks exist');

    this.running = true;

    try {
      await task.operation(task.args);
    } catch (error) {
      if (error instanceof Error) {
        this.showErrorBoundery(error);
      } else {
        this.showErrorBoundery(new Error('Failed during task operation'));
      }
    }

    if (this.#queue.size) {
      this.#run();
    } else {
      this.running = false;
      this.onFinishedRunning.forEach((callback) => callback());
    }
  }

  forEachWaitingTask(callback: (task: Task<TaskTypes>) => void) {
    let current = this.#queue.head;
    while (current) {
      callback(current.value);
      current = current.next;
    }
  }
}
