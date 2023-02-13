import updateHabitListPosition from '../../../../features/dataQueries/stateQueries/updateHabitListPosition';
import { Habit } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';

let habitState: PseudoUseState<Habit[] | undefined>;
let setSelectedIndexState: PseudoUseState<number | null>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);

  setSelectedIndexState = new PseudoUseState<number | null>(0);
});

test('throws an error if the habitId is not found in the habits array', () => {
  expect(() => {
    updateHabitListPosition(4, 0, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
  }).toThrowError('habit with this id doesn\'t exist');
});

test('throws an error if the new list position is out of range', () => {
  expect(() => {
    updateHabitListPosition(1, -1, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
  }).toThrowError('new list position value is out of range');

  expect(() => {
    updateHabitListPosition(1, 3, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
  }).toThrowError('new list position value is out of range');
});

test('updates the array order to reflect the updated list position', () => {
  updateHabitListPosition(1, 2, {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
  });
  expect(habitState.value).toEqual([
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
    { id: 1, name: 'exercise' },
  ]);
});

describe('shifts all other habits around to maintain the same order, ignoring the reordered habit', () => {
  test('moving the first positioned habit to the middle position', () => {
    updateHabitListPosition(1, 1, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 2, name: 'read' },
      { id: 1, name: 'exercise' },
      { id: 3, name: 'sleep' },
    ]);
  });

  test('moving the first positioned habit to the last position', () => {
    updateHabitListPosition(1, 2, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 2, name: 'read' },
      { id: 3, name: 'sleep' },
      { id: 1, name: 'exercise' },
    ]);
  });

  test('moving the middle positioned habit to the first position', () => {
    updateHabitListPosition(2, 0, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 2, name: 'read' },
      { id: 1, name: 'exercise' },
      { id: 3, name: 'sleep' },
    ]);
  });

  test('moving the middle positioned habit to the last position', () => {
    updateHabitListPosition(2, 2, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise' },
      { id: 3, name: 'sleep' },
      { id: 2, name: 'read' },
    ]);
  });

  test('moving the last positioned habit to the first position', () => {
    updateHabitListPosition(3, 0, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 3, name: 'sleep' },
      { id: 1, name: 'exercise' },
      { id: 2, name: 'read' },
    ]);
  });

  test('moving the last positioned habit to the middle position', () => {
    updateHabitListPosition(3, 1, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setSelectedIndex: setSelectedIndexState.setState.bind(setSelectedIndexState),
    });
    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise' },
      { id: 3, name: 'sleep' },
      { id: 2, name: 'read' },
    ]);
  });
});
