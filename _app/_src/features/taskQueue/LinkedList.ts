/* eslint-disable max-classes-per-file */
class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export default class LinkedList<T> {
  head: LinkedListNode<T> | null = null;
  tail: LinkedListNode<T> | null = null;
  size = 0;

  shift(): T | null {
    if (!this.head) return null;

    const node = this.head;
    this.head = node.next;

    this.size -= 1;

    if (this.size === 0) {
      this.tail = null;
    }

    return node.value;
  }

  push(value: T) {
    const node = new LinkedListNode(value);

    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }

    this.size += 1;

    return node;
  }

  forEach(callback: (value: T) => void) {
    let current = this.head;
    while (current) {
      callback(current.value);
      current = current.next;
    }
  }
}
