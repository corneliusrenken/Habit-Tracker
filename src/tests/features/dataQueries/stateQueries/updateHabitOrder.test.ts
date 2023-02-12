import updateHabitOrder from '../../../../features/dataQueries/stateQueries/updateHabitOrder';
import { Habit } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';

let habitState: PseudoUseState<Habit[] | undefined>;
let setSelectedIndexState: PseudoUseState<number | null>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise', orderInList: 0 },
    { id: 2, name: 'read', orderInList: 1 },
    { id: 3, name: 'sleep', orderInList: 2 },
  ]);

  setSelectedIndexState = new PseudoUseState<number | null>(0);
});

test('throws an error if the habitId is not found in the habits array', () => {
  expect(() => {
    updateHabitOrder(4, 0, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
  }).toThrowError('habit with this id doesn\'t exist');
});

test('throws an error if the new order index is out of range', () => {
  expect(() => {
    updateHabitOrder(1, -1, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
  }).toThrowError('new order value out of range');

  expect(() => {
    updateHabitOrder(1, 3, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
  }).toThrowError('new order value out of range');
});

test('updates the array order, orderInList property, and sets the selected index to the new order', () => {
  updateHabitOrder(1, 2, {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
  });
  expect(habitState.value).toEqual([
    { id: 2, name: 'read', orderInList: 0 },
    { id: 3, name: 'sleep', orderInList: 1 },
    { id: 1, name: 'exercise', orderInList: 2 },
  ]);
});

describe('shifts all other habits around to maintain the same order, ignoring the reordered habit', () => {
  test('moving the first positioned habit to the middle position', () => {
    updateHabitOrder(1, 1, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 2, name: 'read', orderInList: 0 },
      { id: 1, name: 'exercise', orderInList: 1 },
      { id: 3, name: 'sleep', orderInList: 2 },
    ]);
  });

  test('moving the first positioned habit to the last position', () => {
    updateHabitOrder(1, 2, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 2, name: 'read', orderInList: 0 },
      { id: 3, name: 'sleep', orderInList: 1 },
      { id: 1, name: 'exercise', orderInList: 2 },
    ]);
  });

  test('moving the middle positioned habit to the first position', () => {
    updateHabitOrder(2, 0, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 2, name: 'read', orderInList: 0 },
      { id: 1, name: 'exercise', orderInList: 1 },
      { id: 3, name: 'sleep', orderInList: 2 },
    ]);
  });

  test('moving the middle positioned habit to the last position', () => {
    updateHabitOrder(2, 2, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise', orderInList: 0 },
      { id: 3, name: 'sleep', orderInList: 1 },
      { id: 2, name: 'read', orderInList: 2 },
    ]);
  });

  test('moving the last positioned habit to the first position', () => {
    updateHabitOrder(3, 0, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 3, name: 'sleep', orderInList: 0 },
      { id: 1, name: 'exercise', orderInList: 1 },
      { id: 2, name: 'read', orderInList: 2 },
    ]);
  });

  test('moving the last positioned habit to the middle position', () => {
    updateHabitOrder(3, 1, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise', orderInList: 0 },
      { id: 3, name: 'sleep', orderInList: 1 },
      { id: 2, name: 'read', orderInList: 2 },
    ]);
  });
});
