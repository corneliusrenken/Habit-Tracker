import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import { addHabitClient } from '../../../../features/tasks/clientSideFunctions';

let habitState: PseudoUseState<Habit[]>;
let streaksState: PseudoUseState<Streaks>;
let occurrenceDataState: PseudoUseState<OccurrenceData>;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[]>([
    { id: 1, name: 'exercise' },
  ]);

  streaksState = new PseudoUseState<Streaks>({
    1: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: {
      1: '2023-02-16',
    },
    dates: {
      '2023-02-16': {
        1: { complete: false, visible: true },
      },
    },
  });
});

test('throws if the habit id already exists', () => {
  expect(() => {
    addHabitClient(1, 'read', '2023-02-16', {
      setHabits: habitState.setState.bind(habitState),
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrow('habit id has to be unique');
});

test('adds the habit to the habit state', () => {
  addHabitClient(2, 'read', '2023-02-16', {
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(habitState.value).toEqual([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
  ]);
});

test('adds an incomplete, visible occurrence to the current date, and sets the current date as the oldest occurrence', () => {
  addHabitClient(2, 'read', '2023-02-16', {
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: '2023-02-16',
      2: '2023-02-16',
    },
    dates: {
      '2023-02-16': {
        1: { complete: false, visible: true },
        2: { complete: false, visible: true },
      },
    },
  });
});

test('adds a new streak entry for the new habit', () => {
  addHabitClient(2, 'read', '2023-02-16', {
    setHabits: habitState.setState.bind(habitState),
    setStreaks: streaksState.setState.bind(streaksState),
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
    2: { current: 0, maximum: 0 },
  });
});
