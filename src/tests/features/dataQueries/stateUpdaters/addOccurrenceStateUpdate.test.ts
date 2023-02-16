import { OccurrenceData } from '../../../../globalTypes';
import PseudoUseState from '../../helperFunctions/pseudoUseState';
import { addOccurrenceStateUpdate } from '../../../../features/dataQueries/stateUpdaters';

let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;

beforeEach(() => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-16',
      2: null,
    },
    dates: {
      '2023-02-16': {
        1: { complete: false, visible: true },
      },
    },
  });
});

test('throws if the date already contains an occurrence for that habit', () => {
  expect(() => {
    addOccurrenceStateUpdate(1, '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrow('occurrence with the given parameters already exists');
});

test('throws if a day entry doesn\'t exist for the passed date', () => {
  expect(() => {
    addOccurrenceStateUpdate(1, '2023-02-15', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });
  }).toThrow('day entry for the passed date doesn\'t exist');
});

test('adds an incomplete, visible occurrence to the passed date', () => {
  addOccurrenceStateUpdate(2, '2023-02-16', {
    setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
  });

  expect(occurrenceDataState.value?.dates).toEqual({
    '2023-02-16': {
      1: { complete: false, visible: true },
      2: { complete: false, visible: true },
    },
  });
});

describe('if the habit\'s oldest occurrence is null, it is set to the passed date. Otherwise the older of the two dates is chosen', () => {
  test('oldest is null', () => {
    addOccurrenceStateUpdate(2, '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: '2023-02-16',
      2: '2023-02-16',
    });
  });

  test('oldest is not null, and the passed date is older', () => {
    occurrenceDataState.setState({
      oldest: {
        1: null,
        2: '2023-02-16',
      },
      dates: {
        '2023-02-15': {},
        '2023-02-16': {
          2: { complete: false, visible: true },
        },
      },
    });

    addOccurrenceStateUpdate(2, '2023-02-15', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: null,
      2: '2023-02-15',
    });
  });

  test('oldest is not null, and the passed date is newer', () => {
    occurrenceDataState.setState({
      oldest: {
        1: null,
        2: '2023-02-15',
      },
      dates: {
        '2023-02-15': {
          2: { complete: false, visible: true },
        },
        '2023-02-16': {},
      },
    });

    addOccurrenceStateUpdate(2, '2023-02-16', {
      setOccurrenceData: occurrenceDataState.setState.bind(occurrenceDataState),
    });

    expect(occurrenceDataState.value?.oldest).toEqual({
      1: null,
      2: '2023-02-15',
    });
  });
});
