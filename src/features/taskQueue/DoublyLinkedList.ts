/* eslint-disable max-classes-per-file */
class Node<T> {
  value: T;
  next: Node<T> | null = null;
  prev: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export default class DoublyLinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  size = 0;

  unshift(value: T) {
    const node = new Node(value);

    if (this.tail) {
      this.tail.prev = node;
    }
    node.next = this.tail;
    this.tail = node;

    if (!this.head) {
      this.head = node;
    }

    this.size += 1;
  }

  pop() {
    if (!this.head) return undefined;

    const { value } = this.head;

    this.head = this.head.prev;

    this.size -= 1;

    return value;
  }
}
