import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import { deleteHabitStateUpdate } from '../../../../features/dataQueries/stateUpdaters';

let habitState: PseudoUseState<Habit[] | undefined>;
let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;
let streaksState: PseudoUseState<Streaks | undefined>;
let selectedIndexState: PseudoUseState<number | null>;
let inInputState: PseudoUseState<boolean>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-16',
      2: '2023-02-13',
      3: '2023-02-15',
    },
    dates: {
      '2023-02-13': {
        2: { complete: false, visible: true },
      },
      '2023-02-15': {
        3: { complete: false, visible: true },
        2: { complete: false, visible: true },
      },
      '2023-02-16': {
        1: { complete: false, visible: true },
      },
    },
  });

  streaksState = new PseudoUseState<Streaks | undefined>({
    1: { current: 0, maximum: 0 },
    2: { current: 0, maximum: 0 },
    3: { current: 0, maximum: 0 },
  });

  selectedIndexState = new PseudoUseState<number | null>(1);

  inInputState = new PseudoUseState<boolean>(false);
});

test('throws if the habit id does not exist', () => {
  expect(() => {
    deleteHabitStateUpdate(4, {
      setHabits: habitState.setState.bind(habitState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      setInInput: inInputState.setState.bind(inInputState),
    });
  }).toThrow('habit with this id doesn\'t exist');
});

test('deletes the habit from the habit state', () => {
  deleteHabitStateUpdate(2, {
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise' },
    { id: 3, name: 'sleep' },
  ]);

  deleteHabitStateUpdate(1, {
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(habitState.value).toEqual([
    { id: 3, name: 'sleep' },
  ]);

  deleteHabitStateUpdate(3, {
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(habitState.value).toEqual([]);
});

test('deletes the habit from the occurrence data state', () => {
  deleteHabitStateUpdate(2, {
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: '2023-02-16',
      3: '2023-02-15',
    },
    dates: {
      '2023-02-13': {},
      '2023-02-15': {
        3: { complete: false, visible: true },
      },
      '2023-02-16': {
        1: { complete: false, visible: true },
      },
    },
  });
});

test('deletes the habit from the streaks state', () => {
  deleteHabitStateUpdate(2, {
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
    3: { current: 0, maximum: 0 },
  });
});

describe('selected index', () => {
  test('when deleting any habit that is not the last habit, the selected index is not changed', () => {
    deleteHabitStateUpdate(2, {
      setHabits: habitState.setState.bind(habitState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      setInInput: inInputState.setState.bind(inInputState),
    });

    expect(selectedIndexState.value).toEqual(1);
    expect(inInputState.value).toEqual(false);
  });

  test('when deleting the habit at the last position, but multiple habits exist, the selected index is set to the new last habit position', () => {
    selectedIndexState.setState(2);

    deleteHabitStateUpdate(3, {
      setHabits: habitState.setState.bind(habitState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      setInInput: inInputState.setState.bind(inInputState),
    });

    expect(selectedIndexState.value).toEqual(1);
    expect(inInputState.value).toEqual(false);
  });

  test('when deleting the last habit, the selected index is set to the create-habit input and setInInput is set to true', () => {
    habitState.setState([{ id: 1, name: 'exercise' }]);
    selectedIndexState.setState(0);

    deleteHabitStateUpdate(1, {
      setHabits: habitState.setState.bind(habitState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      setInInput: inInputState.setState.bind(inInputState),
    });

    expect(selectedIndexState.value).toEqual(0);
    expect(inInputState.value).toEqual(true);
  });
});
