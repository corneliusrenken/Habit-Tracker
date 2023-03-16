import { OccurrenceData, Streaks } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import { deleteOccurrenceClient } from '../../../../features/tasks/clientSideFunctions';

let occurrenceDataState: PseudoUseState<OccurrenceData>;
let streaksState: PseudoUseState<Streaks>;

beforeEach(() => {
  occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: {
      1: '2023-02-15',
    },
    dates: {
      '2023-02-15': {
        1: { complete: true, visible: true },
      },
    },
  });

  streaksState = new PseudoUseState<Streaks>({
    1: { current: 1, maximum: 1 },
  });
});

test('throws if no day entry exists for given date', () => {
  expect(() => {
    deleteOccurrenceClient(1, '2023-02-16', '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
    });
  }).toThrow('day entry does not exist for given date');
});

test('throws if the habit has no occurrence on the given date', () => {
  expect(() => {
    deleteOccurrenceClient(2, '2023-02-15', '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
    });
  }).toThrow('occurrence does not exist for given date and habit id');
});

test('throws if the habit has no oldest occurrence', () => {
  expect(() => {
    occurrenceDataState.setState({
      oldest: {},
      dates: {
        '2023-02-15': {
          1: { complete: true, visible: true },
        },
      },
    });

    deleteOccurrenceClient(1, '2023-02-15', '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
    });
  }).toThrow('oldest occurrence does not exist for given date and habit id');
});

test('deletes the occurrence', () => {
  deleteOccurrenceClient(1, '2023-02-15', '2023-02-16', {
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
  });

  expect(occurrenceDataState.value?.dates).toEqual({
    '2023-02-15': {},
  });
});

describe('updates the oldest occurrence', () => {
  test('if the occurrence being deleted is the only occurrence from the habit, and the current oldest occurrence, the oldest occurrence is set to null', () => {
    deleteOccurrenceClient(1, '2023-02-15', '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: null,
    });
  });

  test('if the occurrence being deleted is the current oldest occurrence, but a newer one exists, the oldest occurrence is set to the newer date', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-14',
      },
      dates: {
        '2023-02-14': {
          1: { complete: true, visible: true },
        },
        '2023-02-15': {
          1: { complete: true, visible: true },
        },
      },
    });

    deleteOccurrenceClient(1, '2023-02-14', '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-15',
    });
  });

  test('if the occurrence being deleted is not the current oldest occurrence, the oldest occurrence stays the same', () => {
    occurrenceDataState.setState({
      oldest: {
        1: '2023-02-14',
      },
      dates: {
        '2023-02-14': {
          1: { complete: true, visible: true },
        },
        '2023-02-15': {
          1: { complete: true, visible: true },
        },
      },
    });

    deleteOccurrenceClient(1, '2023-02-15', '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
      setStreaks: streaksState.setState.bind(streaksState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-14',
    });
  });
});

test('recalculates the streak for the habit whose occurrence was deleted', () => {
  deleteOccurrenceClient(1, '2023-02-15', '2023-02-16', {
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    setStreaks: streaksState.setState.bind(streaksState),
  });

  expect(streaksState.value).toEqual({
    1: { current: 0, maximum: 0 },
  });
});
