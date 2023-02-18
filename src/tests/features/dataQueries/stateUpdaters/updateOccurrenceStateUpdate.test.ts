import { OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import updateOcccurrenceStateUpdate from '../../../../features/dataQueries/stateUpdaters/updateOccurrenceStateUpdate';

let streaksState: PseudoUseState<Streaks | undefined>;
let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;

beforeEach(() => {
  streaksState = new PseudoUseState<Streaks | undefined>({
    1: { current: 0, maximum: 0 },
  });

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-10',
    },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: true } },
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
    updateOcccurrenceStateUpdate(10, '2023-02-10', '2023-02-16', { complete: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('day entry does not exist for given date');
});

test('throws an error no occurrence matches the date and habit id', () => {
  expect(() => {
    updateOcccurrenceStateUpdate(2, '2023-02-10', '2023-02-16', { complete: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrowError('occurrence does not exist for given date and habit id');
});

describe('updating the occurrence visibile property', () => {
  test('updates the visible property on the occurrence', () => {
    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.dates).toEqual({
      '2023-02-10': { 1: { complete: true, visible: false } },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.dates).toEqual({
      '2023-02-10': { 1: { complete: true, visible: true } },
    });
  });

  test('if the oldest occurrence was the one that was hidden, and a newer occurrence exists, the oldest property is updated to the newer occurrence', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-10',
      },
      dates: {
        '2023-02-10': { 1: { complete: true, visible: true } },
        '2023-02-14': { 1: { complete: true, visible: true } },
      },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-14',
    });
  });

  test('if the oldest occurrence was the one that was hidden, and no newer occurrence exists, the oldest property is updated to null', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-10',
      },
      dates: {
        '2023-02-10': { 1: { complete: true, visible: true } },
      },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: null,
    });
  });

  test('if the oldest occurrence was the one that was hidden, and the newer occurrence is newer than the current date, the oldest property is updated to null', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-10',
      },
      dates: {
        '2023-02-10': { 1: { complete: true, visible: true } },
        '2023-02-17': { 1: { complete: true, visible: true } },
      },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: null,
    });
  });

  test('when setting an occurrence to visible, if the oldest occurrence is null, the oldest property is updated to the new occurrence', () => {
    occurrenceDataState.setState({
      oldest: {
        1: null,
      },
      dates: {
        '2023-02-10': { 1: { complete: true, visible: false } },
      },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-10',
    });
  });

  test('when setting an occurrence to visible, if the oldest occurrence is older than the updated occurrence, the oldest property stays the same', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-10',
      },
      dates: {
        '2023-02-10': { 1: { complete: true, visible: true } },
        '2023-02-11': { 1: { complete: true, visible: false } },
      },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-11', '2023-02-16', { visible: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-10',
    });
  });

  test('when setting an occurrence to visible, if the oldest occurrence is newer than the updated occurrence, the oldest property is updated to the updated occurrence date', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-11',
      },
      dates: {
        '2023-02-10': { 1: { complete: true, visible: false } },
        '2023-02-11': { 1: { complete: true, visible: true } },
      },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { visible: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-10',
    });
  });
});

describe('updating the occurrence complete property', () => {
  test('updates the complete property on the occurrence', () => {
    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { complete: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.dates).toEqual({
      '2023-02-10': { 1: { complete: false, visible: true } },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-10', '2023-02-16', { complete: true }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.dates).toEqual({
      '2023-02-10': { 1: { complete: true, visible: true } },
    });
  });

  test('recalculates the streak when the complete property is updated', () => {
    // uses already tested streak calculation logic (recalculateStreaks.ts)
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-10',
      },
      dates: {
        '2023-02-13': { 1: { complete: true, visible: true } },
        '2023-02-14': { 1: { complete: true, visible: true } },
        '2023-02-16': { 1: { complete: true, visible: true } },
      },
    });

    streaksState.setState({
      1: { current: 1, maximum: 2 },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-14', '2023-02-16', { complete: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 1, maximum: 1 },
    });

    updateOcccurrenceStateUpdate(1, '2023-02-16', '2023-02-16', { complete: false }, {
      setStreaks: streaksState.setState.bind(streaksState),
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(streaksState.value).toEqual({
      1: { current: 0, maximum: 1 },
    });
  });
});
