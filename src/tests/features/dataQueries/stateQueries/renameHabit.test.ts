import renameHabit from '../../../../features/dataQueries/stateQueries/renameHabit';
import { Habit } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';

let habitState: PseudoUseState<Habit[] | undefined>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise', orderInList: 0 },
    { id: 2, name: 'read', orderInList: 1 },
    { id: 3, name: 'sleep', orderInList: 2 },
  ]);
});

test('throws an error if the habit id does not exist', () => {
  expect(() => {
    renameHabit(-1, 'new name', {
      setHabits: habitState.setState.bind(habitState),
    });
  }).toThrowError('habit with this id doesn\'t exist');
});

test('renames habit', () => {
  renameHabit(1, 'new name', {
    setHabits: habitState.setState.bind(habitState),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'new name', orderInList: 0 },
    { id: 2, name: 'read', orderInList: 1 },
    { id: 3, name: 'sleep', orderInList: 2 },
  ]);
});
