import updateHabitVisibility from '../../../../features/dataQueries/stateQueries/updateHabitVisibility';
import { OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';

let streaksState: PseudoUseState<Streaks | undefined>;
let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;

beforeEach(() => {
  streaksState = new PseudoUseState<Streaks | undefined>({
    1: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
    },
    dates: {
      '2023-02-10': { 1: { complete: false, visible: true } },
    },
  });
});

test('throws an error if the date is not in the dates object', () => {
  streaksState = new PseudoUseState<Streaks | undefined>({});
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {},
    dates: {},
  });

  expect(() => {
    updateHabitVisibility(10, true, '2023-02-10', {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('no date entry exists with the given date string');
});

test('throws an error if the habit does not exist in the date object', () => {
  expect(() => {
    updateHabitVisibility(2, true, '2023-02-10', {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('the date contains no entry for the given habit id');
});

test('when the habit is not complete, setting the visibility to false deletes the entry', () => {
  updateHabitVisibility(1, false, '2023-02-10', {
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: null,
    },
    dates: {
      '2023-02-10': {},
    },
  });
});

test('when the habit is complete, setting the visibility to false keeps the entry, and simply updates the value', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-10',
    },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  updateHabitVisibility(1, false, '2023-02-10', {
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: null,
    },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: false } },
    },
  });
});

// it has to be null as, in the current implementation,
// the visibility can only be set for the current date = no newer occurrence can exist
test('when setting the previously oldest occurrence to invisible, the new oldest occurrence value is null', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-10',
    },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  updateHabitVisibility(1, false, '2023-02-10', {
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value).toEqual({
    oldest: {
      1: null,
    },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: false } },
    },
  });
});

test('updating a complete habit to be invisible recalcultes the streaks', () => {
  streaksState = new PseudoUseState<Streaks | undefined>({
    1: { current: 2, maximum: 2 },
  });
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-09',
    },
    dates: {
      '2023-02-09': { 1: { complete: true, visible: true } },
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  updateHabitVisibility(1, false, '2023-02-10', {
    streaks: streaksState.value,
    setStreaks: streaksState.setState.bind(streaksState),
    occurrenceData: occurrenceDataState.value,
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 1, maximum: 1 },
  });
});
