import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import updateHabitId from '../../../../features/dataQueries/stateQueries/updateHabitId';

let habitState: PseudoUseState<Habit[] | undefined>;
let streaksState: PseudoUseState<Streaks | undefined>;
let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);

  streaksState = new PseudoUseState<Streaks | undefined>({
    1: { current: 0, maximum: 0 },
    2: { current: 1, maximum: 1 },
    3: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-13',
      2: '2023-02-14',
      3: '2023-02-13',
    },
    dates: {
      '2023-02-13': {
        1: { complete: false, visible: true },
        3: { complete: false, visible: true },
      },
      '2023-02-14': {
        2: { complete: true, visible: true },
      },
      '2023-02-15': {
        1: { complete: false, visible: true },
        2: { complete: false, visible: false },
        3: { complete: false, visible: true },
      },
    },
  });
});

test('throws an error if the old, to update, habit id does not exist', () => {
  expect(() => {
    updateHabitId(4, 1234, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('no habit exists with the given id');

  habitState.setState([]);

  expect(() => {
    updateHabitId(1, 1234, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('no habit exists with the given id');
});

test('throws an error if the new habit id already exists', () => {
  expect(() => {
    updateHabitId(2, 1, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('habit id has to be unique');
});

test('does not throw if the old and new ids are the same', () => {
  expect(() => {
    updateHabitId(2, 2, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).not.toThrowError();
});

test('updates the id in the habit state', () => {
  updateHabitId(2, 1234, {
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise' },
    { id: 1234, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);
});

test('updates the id in the streaks state', () => {
  updateHabitId(2, 1234, {
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
    1234: { current: 1, maximum: 1 },
    3: { current: 0, maximum: 0 },
  });
});

test('updates the id in the occurrenceData state', () => {
  updateHabitId(2, 1234, {
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: '2023-02-13',
      1234: '2023-02-14',
      3: '2023-02-13',
    },
    dates: {
      '2023-02-13': {
        1: { complete: false, visible: true },
        3: { complete: false, visible: true },
      },
      '2023-02-14': {
        1234: { complete: true, visible: true },
      },
      '2023-02-15': {
        1: { complete: false, visible: true },
        1234: { complete: false, visible: false },
        3: { complete: false, visible: true },
      },
    },
  });
});
