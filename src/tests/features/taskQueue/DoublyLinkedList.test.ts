import DoublyLinkedList from '../../../features/taskQueue/DoublyLinkedList';

test('adding an item to the tail of the list updates the tail property', () => {
  const list = new DoublyLinkedList<number>();
  expect(list.tail).toBe(null);
  list.unshift(1);
  expect(list.tail?.value).toBe(1);
  list.unshift(2);
  expect(list.tail?.value).toBe(2);
  list.unshift(3);
  expect(list.tail?.value).toBe(3);
});

test('adding the first item to the tail also sets the head', () => {
  const list = new DoublyLinkedList<number>();
  expect(list.head).toBe(null);
  list.unshift(1);
  expect(list.head?.value).toBe(1);
  list.unshift(2);
  expect(list.head?.value).toBe(1);
});

test('removing an item from the head of the list sets the head to be next in line and returns the removed item', () => {
  const list = new DoublyLinkedList<number>();
  list.unshift(1);
  list.unshift(2);
  list.unshift(3);
  expect(list.head?.value).toBe(1);
  expect(list.pop()).toBe(1);
  expect(list.head?.value).toBe(2);
  expect(list.pop()).toBe(2);
  expect(list.head?.value).toBe(3);
  expect(list.pop()).toBe(3);
  expect(list.head).toBe(null);
});

test('removing the last item sets the head and tail to null', () => {
  const list = new DoublyLinkedList<number>();
  list.unshift(1);
  expect(list.head?.value).toBe(1);
  expect(list.tail?.value).toBe(1);
  expect(list.pop()).toBe(1);
  expect(list.head).toBe(null);
  expect(list.tail).toBe(null);
});

test('removing an item from the head when the list is empty returns undefined', () => {
  const list = new DoublyLinkedList<number>();
  expect(list.pop()).toBe(undefined);
});

test('returns the correct size of the list', () => {
  const list = new DoublyLinkedList<number>();
  expect(list.size).toBe(0);
  list.unshift(1);
  expect(list.size).toBe(1);
  list.unshift(2);
  expect(list.size).toBe(2);
  list.unshift(3);
  expect(list.size).toBe(3);
});
