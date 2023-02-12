import addHabit from '../../../../features/dataQueries/stateQueries/addHabit';
import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';

let habitState: PseudoUseState<Habit[] | undefined>;
let streaksState: PseudoUseState<Streaks | undefined>;
let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise', orderInList: 0 },
    { id: 2, name: 'read', orderInList: 1 },
    { id: 3, name: 'sleep', orderInList: 2 },
  ]);

  streaksState = new PseudoUseState<Streaks | undefined>({
    1: { current: 0, maximum: 0 },
    2: { current: 0, maximum: 0 },
    3: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
    },
    dates: {
      '2023-02-10': {
        1: { complete: false, visible: true },
        2: { complete: false, visible: true },
        3: { complete: false, visible: true },
      },
    },
  });
});

test('adds new habit to habit state, using the given name and id', () => {
  addHabit('one', 4, '2023-02-10', {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise', orderInList: 0 },
    { id: 2, name: 'read', orderInList: 1 },
    { id: 3, name: 'sleep', orderInList: 2 },
    { id: 4, name: 'one', orderInList: 3 },
  ]);

  addHabit('two', 100, '2023-02-10', {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise', orderInList: 0 },
    { id: 2, name: 'read', orderInList: 1 },
    { id: 3, name: 'sleep', orderInList: 2 },
    { id: 4, name: 'one', orderInList: 3 },
    { id: 100, name: 'two', orderInList: 4 },
  ]);
});

test('adds a new streak entry with both current and maximum as 0', () => {
  addHabit('one', 4, '2023-02-10', {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
    2: { current: 0, maximum: 0 },
    3: { current: 0, maximum: 0 },
    4: { current: 0, maximum: 0 },
  });

  addHabit('two', 100, '2023-02-10', {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
    2: { current: 0, maximum: 0 },
    3: { current: 0, maximum: 0 },
    4: { current: 0, maximum: 0 },
    100: { current: 0, maximum: 0 },
  });
});

test('adds a new occurrence entry, on the passed date, that is visible and incomplete', () => {
  addHabit('one', 4, '2023-02-10', {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: null,
    },
    dates: {
      '2023-02-10': {
        1: { complete: false, visible: true },
        2: { complete: false, visible: true },
        3: { complete: false, visible: true },
        4: { complete: false, visible: true },
      },
    },
  });

  addHabit('two', 100, '2023-02-10', {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: null,
      100: null,
    },
    dates: {
      '2023-02-10': {
        1: { complete: false, visible: true },
        2: { complete: false, visible: true },
        3: { complete: false, visible: true },
        4: { complete: false, visible: true },
        100: { complete: false, visible: true },
      },
    },
  });
});
