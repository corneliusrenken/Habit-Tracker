import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import { deleteHabitClient } from '../../../../features/tasks/clientSideFunctions';

let habitState: PseudoUseState<Habit[]>;
let occurrenceDataState: PseudoUseState<OccurrenceData>;
let streaksState: PseudoUseState<Streaks>;
let selectedIndexState: PseudoUseState<number | null>;
let inInputState: PseudoUseState<boolean>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[]>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);

  occurrenceDataState = new PseudoUseState<OccurrenceData>({
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

  streaksState = new PseudoUseState<Streaks>({
    1: { current: 0, maximum: 0 },
    2: { current: 0, maximum: 0 },
    3: { current: 0, maximum: 0 },
  });

  selectedIndexState = new PseudoUseState<number | null>(1);

  inInputState = new PseudoUseState<boolean>(false);
});

test('throws if the habit id does not exist', () => {
  expect(() => {
    deleteHabitClient(4, {
      habits: habitState.value,
      setHabits: habitState.setState.bind(habitState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      setInInput: inInputState.setState.bind(inInputState),
    });
  }).toThrow('habit with this id doesn\'t exist');
});

test('deletes the habit from the habit state', () => {
  deleteHabitClient(2, {
    habits: habitState.value,
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

  deleteHabitClient(1, {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(habitState.value).toEqual([
    { id: 3, name: 'sleep' },
  ]);

  deleteHabitClient(3, {
    habits: habitState.value,
    setHabits: habitState.setState.bind(habitState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
    setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    setInInput: inInputState.setState.bind(inInputState),
  });

  expect(habitState.value).toEqual([]);
});

test('deletes the habit from the occurrence data state', () => {
  deleteHabitClient(2, {
    habits: habitState.value,
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
  deleteHabitClient(2, {
    habits: habitState.value,
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
    deleteHabitClient(2, {
      habits: habitState.value,
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

    deleteHabitClient(3, {
      habits: habitState.value,
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

    deleteHabitClient(1, {
      habits: habitState.value,
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
