import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import { updateHabitStateUpdate } from '../../../../features/dataQueries/stateUpdaters';

let habitState: PseudoUseState<Habit[]>;
let streaksState: PseudoUseState<Streaks>;
let occurrenceDataState: PseudoUseState<OccurrenceData>;
let selectedIndexState = new PseudoUseState<number | null>(0);

beforeEach(() => {
  habitState = new PseudoUseState<Habit[]>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
  ]);

  streaksState = new PseudoUseState<Streaks>({
    1: { current: 0, maximum: 0 },
    2: { current: 1, maximum: 1 },
    3: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData>({
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

  selectedIndexState = new PseudoUseState<number | null>(0);
});

test('throws if the habit does not exist', () => {
  expect(() => {
    updateHabitStateUpdate(4, { id: 2 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });
  }).toThrow('no habit exists with the given id');
});

describe('updating the habit name', () => {
  test('updates the habit name', () => {
    updateHabitStateUpdate(1, { name: 'new name' }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(habitState.value).toEqual([
      { id: 1, name: 'new name' },
      { id: 2, name: 'read' },
      { id: 3, name: 'sleep' },
    ]);
  });
});

describe('updating the habit list position', () => {
  test('throws if the new list position is out of bounds', () => {
    expect(() => {
      updateHabitStateUpdate(1, { listPosition: 3 }, {
        setHabits: habitState.setState.bind(habitState),
        setStreaks: streaksState.setState.bind(streaksState),
        setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
        setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      });
    }).toThrow('new list position is out of bounds');

    expect(() => {
      updateHabitStateUpdate(1, { listPosition: -1 }, {
        setHabits: habitState.setState.bind(habitState),
        setStreaks: streaksState.setState.bind(streaksState),
        setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
        setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      });
    }).toThrow('new list position is out of bounds');
  });

  test('updates the habit list position', () => {
    updateHabitStateUpdate(1, { listPosition: 1 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(habitState.value).toEqual([
      { id: 2, name: 'read' },
      { id: 1, name: 'exercise' },
      { id: 3, name: 'sleep' },
    ]);

    updateHabitStateUpdate(1, { listPosition: 0 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise' },
      { id: 2, name: 'read' },
      { id: 3, name: 'sleep' },
    ]);

    updateHabitStateUpdate(1, { listPosition: 2 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(habitState.value).toEqual([
      { id: 2, name: 'read' },
      { id: 3, name: 'sleep' },
      { id: 1, name: 'exercise' },
    ]);

    updateHabitStateUpdate(1, { listPosition: 0 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise' },
      { id: 2, name: 'read' },
      { id: 3, name: 'sleep' },
    ]);
  });

  test('sets the selected index to the new list position', () => {
    updateHabitStateUpdate(1, { listPosition: 2 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(selectedIndexState.value).toBe(2);
  });
});

describe('updating the habit id', () => {
  test('throws an error if the new habit id already exists', () => {
    expect(() => {
      updateHabitStateUpdate(2, { id: 1 }, {
        setHabits: habitState.setState.bind(habitState),
        setStreaks: streaksState.setState.bind(streaksState),
        setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
        setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      });
    }).toThrowError('habit id has to be unique');
  });

  test('does not throw if the old and new ids are the same', () => {
    expect(() => {
      updateHabitStateUpdate(2, { id: 2 }, {
        setHabits: habitState.setState.bind(habitState),
        setStreaks: streaksState.setState.bind(streaksState),
        setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
        setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
      });
    }).not.toThrowError();
  });

  test('updates the id in the habit state', () => {
    updateHabitStateUpdate(2, { id: 1234 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(habitState.value).toEqual([
      { id: 1, name: 'exercise' },
      { id: 1234, name: 'read' },
      { id: 3, name: 'sleep' },
    ]);
  });

  test('updates the id in the streaks state', () => {
    updateHabitStateUpdate(2, { id: 1234 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 0, maximum: 0 },
      1234: { current: 1, maximum: 1 },
      3: { current: 0, maximum: 0 },
    });
  });

  test('updates the id in the occurrenceData state', () => {
    updateHabitStateUpdate(2, { id: 1234 }, {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setSelectedIndex: selectedIndexState.setState.bind(selectedIndexState),
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
});
