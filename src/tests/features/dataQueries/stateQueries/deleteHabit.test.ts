import deleteHabit from '../../../../features/dataQueries/stateQueries/deleteHabit';
import { Habit } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';

let habitState: PseudoUseState<Habit[] | undefined>;
let selectedIndexState: PseudoUseState<number | null>;
let inInput: PseudoUseState<boolean>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);

  selectedIndexState = new PseudoUseState<number | null>(0);

  inInput = new PseudoUseState<boolean>(false);
});

test('throws an error if the habit id does not exist', () => {
  expect(() => {
    deleteHabit(4, {
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      setHabits: habitState.setState.bind(habitState),
      setInInput: inInput.setState.bind(inInput),
    });
  }).toThrowError('habit with this id doesn\'t exist');
});

test('deletes habit from habit state using the given id, keeping the order of the other habits the same', () => {
  deleteHabit(2, {
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setHabits: habitState.setState.bind(habitState),
    setInInput: inInput.setState.bind(inInput),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise' },
    { id: 3, name: 'sleep' },
  ]);

  deleteHabit(1, {
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setHabits: habitState.setState.bind(habitState),
    setInInput: inInput.setState.bind(inInput),
  });

  expect(habitState.value).toEqual([
    { id: 3, name: 'sleep' },
  ]);

  deleteHabit(3, {
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setHabits: habitState.setState.bind(habitState),
    setInInput: inInput.setState.bind(inInput),
  });

  expect(habitState.value).toEqual([]);
});

test('sets inInput to true if the habit deleted was the last habit in the list', () => {
  deleteHabit(2, {
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setHabits: habitState.setState.bind(habitState),
    setInInput: inInput.setState.bind(inInput),
  });

  expect(inInput.value).toBe(false);

  deleteHabit(1, {
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setHabits: habitState.setState.bind(habitState),
    setInInput: inInput.setState.bind(inInput),
  });

  expect(inInput.value).toBe(false);

  deleteHabit(3, {
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setHabits: habitState.setState.bind(habitState),
    setInInput: inInput.setState.bind(inInput),
  });

  expect(inInput.value).toBe(true);
});
