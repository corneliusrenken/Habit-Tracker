import LinkedList from '../../../features/taskQueue/LinkedList';

test('adding an item to the tail of the list updates the tail property', () => {
  const list = new LinkedList<number>();
  expect(list.tail).toBe(null);
  list.push(1);
  expect(list.tail?.value).toBe(1);
  list.push(2);
  expect(list.tail?.value).toBe(2);
  list.push(3);
  expect(list.tail?.value).toBe(3);
});

test('adding an item to the tail of the list updates the previous tail\'s next property', () => {
  const list = new LinkedList<number>();
  const tail = list.push(1);
  expect(list.tail).toBe(tail);
  expect(tail.next).toBe(null);
  list.push(2);
  expect(list.tail?.value).toBe(2);
  expect(tail.next?.value).toBe(2);
});

test('adding the first item to the tail also sets the head', () => {
  const list = new LinkedList<number>();
  expect(list.head).toBe(null);
  list.push(1);
  expect(list.head?.value).toBe(1);
  list.push(2);
  expect(list.head?.value).toBe(1);
});

test('removing an item from the head of the list sets the head to be next in line and returns the removed item', () => {
  const list = new LinkedList<number>();
  list.push(1);
  list.push(2);
  list.push(3);
  expect(list.head?.value).toBe(1);
  expect(list.shift()).toBe(1);
  expect(list.head?.value).toBe(2);
  expect(list.shift()).toBe(2);
  expect(list.head?.value).toBe(3);
  expect(list.shift()).toBe(3);
  expect(list.head).toBe(null);
});

test('removing the last item sets the head and tail to null', () => {
  const list = new LinkedList<number>();
  list.push(1);
  expect(list.head?.value).toBe(1);
  expect(list.tail?.value).toBe(1);
  expect(list.shift()).toBe(1);
  expect(list.head).toBe(null);
  expect(list.tail).toBe(null);
});

test('removing an item from the head when the list is empty returns null', () => {
  const list = new LinkedList<number>();
  expect(list.shift()).toBe(null);
});

test('returns the correct size of the list', () => {
  const list = new LinkedList<number>();
  expect(list.size).toBe(0);
  list.push(1);
  expect(list.size).toBe(1);
  list.push(2);
  expect(list.size).toBe(2);
  list.push(3);
  expect(list.size).toBe(3);
});
