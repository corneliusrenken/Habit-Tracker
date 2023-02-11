import { updateHabitCompleted } from '../../../features/frontEndDatabaseQueries';
import { OccurrenceData, Streaks } from '../../../globalTypes';
import PseudoUseState from '../helperFunctions/pseudoUseState';

describe('updating streaks', () => {
  test('updates the streaks state', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({
      1: { current: 0, maximum: 0 },
    });
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: { 1: null },
      dates: {
        '2023-02-09': { 1: { complete: false, visible: true } },
        '2023-02-10': { 1: { complete: false, visible: true } },
      },
    });

    updateHabitCompleted(1, true, '2023-02-10', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 1, maximum: 1 },
    });

    updateHabitCompleted(1, true, '2023-02-09', true, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 2, maximum: 2 },
    });

    updateHabitCompleted(1, false, '2023-02-10', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 1, maximum: 1 },
    });

    updateHabitCompleted(1, false, '2023-02-09', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 0, maximum: 0 },
    });
  });

  // not currently supported
  // eslint-disable-next-line max-len
  // test('updates the streaks state to reflect a new completion that would not update the current property', () => {

  // });
});

describe('updating "oldest" occurrence data', () => {
  test('updates the oldest occurrence when the previous value is newer than the passed date', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({
      1: { current: 0, maximum: 0 },
    });
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: { 1: '2023-02-10' },
      dates: {
        '2023-02-09': { 1: { complete: false, visible: true } },
        '2023-02-10': { 1: { complete: true, visible: true } },
      },
    });

    updateHabitCompleted(1, true, '2023-02-09', true, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value.oldest).toEqual({
      1: '2023-02-09',
    });
  });

  test('sets the oldest occurrence when the previous value is null', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({
      1: { current: 0, maximum: 0 },
    });
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: { 1: null },
      dates: {
        '2023-02-09': { 1: { complete: false, visible: true } },
        '2023-02-10': { 1: { complete: false, visible: true } },
      },
    });

    updateHabitCompleted(1, true, '2023-02-10', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value.oldest).toEqual({
      1: '2023-02-10',
    });
  });

  test('does not update the oldest occurrence when the previous value is older than the passed date', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({
      1: { current: 0, maximum: 0 },
    });
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: { 1: '2023-02-09' },
      dates: {
        '2023-02-09': { 1: { complete: true, visible: true } },
        '2023-02-10': { 1: { complete: false, visible: true } },
      },
    });

    updateHabitCompleted(1, true, '2023-02-10', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value.oldest).toEqual({
      1: '2023-02-09',
    });
  });
});

// No need to ever create a date or habit entry
// the habit must be visible for the user to edit the complete value
describe('updating "dates" occurrence data', () => {
  test('updates the complete value for the given date', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({
      1: { current: 0, maximum: 0 },
    });
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: { 1: '2023-02-09' },
      dates: {
        '2023-02-10': { 1: { complete: false, visible: true } },
      },
    });

    updateHabitCompleted(1, true, '2023-02-10', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value.dates).toEqual({
      '2023-02-10': { 1: { complete: true, visible: true } },
    });

    updateHabitCompleted(1, false, '2023-02-10', false, {
      streaks: streaksState.value,
      setStreaks: streaksState.setState.bind(streaksState),
      occurrenceData: occurrenceDataState.value,
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value.dates).toEqual({
      '2023-02-10': { 1: { complete: false, visible: true } },
    });
  });

  test('throws an error if the date is not in the dates object', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({});
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: {},
      dates: {},
    });

    expect(() => {
      updateHabitCompleted(10, true, '2023-02-10', false, {
        streaks: streaksState.value,
        setStreaks: streaksState.setState.bind(streaksState),
        occurrenceData: occurrenceDataState.value,
        setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      });
    }).toThrowError('no date entry exists with the given date string');
  });

  test('throws an error if the habit does not exist in the date object', () => {
    const streaksState = new PseudoUseState<Streaks | undefined>({
      1: { current: 0, maximum: 0 },
    });
    const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: { 1: '2023-02-09' },
      dates: {
        '2023-02-10': { 1: { complete: false, visible: true } },
      },
    });

    expect(() => {
      updateHabitCompleted(2, true, '2023-02-10', false, {
        streaks: streaksState.value,
        setStreaks: streaksState.setState.bind(streaksState),
        occurrenceData: occurrenceDataState.value,
        setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      });
    }).toThrowError('the date contains no entry for the given habit id');
  });
});
