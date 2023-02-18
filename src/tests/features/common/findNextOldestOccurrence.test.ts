import findNextOldestOccurrence from '../../../features/common/findNextOldestOccurrence';
import { OccurrenceData } from '../../../globalTypes';
import PseudoUseState from '../helperFunctions/pseudoUseState';

test('throws an error if the habit id does not have an oldest occurrence entry', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {},
    dates: {},
  });

  expect(() => {
    findNextOldestOccurrence(1, '2023-02-16', '2023-02-16', occurrenceDataState.value);
  }).toThrowError('no oldest occurrence entry exists for the given habit id');
});

test('returns null if no newer occurrences exist', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: { 1: '2023-02-14' },
    dates: {
      '2023-02-14': { 1: { complete: true, visible: true } },
    },
  });

  const nextOldestOccurrence = findNextOldestOccurrence(1, '2023-02-14', '2023-02-16', occurrenceDataState.value);

  expect(nextOldestOccurrence).toBe(null);
});

test('ignores occurrences that are not visible', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: { 1: '2023-02-14' },
    dates: {
      '2023-02-14': { 1: { complete: true, visible: true } },
      '2023-02-15': { 1: { complete: true, visible: false } },
      '2023-02-16': { 1: { complete: false, visible: false } },
    },
  });

  const nextOldestOccurrence = findNextOldestOccurrence(1, '2023-02-14', '2023-02-16', occurrenceDataState.value);

  expect(nextOldestOccurrence).toBe(null);
});

test('ignores occurrences that are past the \'current date\' argument', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: { 1: '2023-02-14' },
    dates: {
      '2023-02-14': { 1: { complete: true, visible: true } },
      '2023-02-17': { 1: { complete: true, visible: true } },
    },
  });

  const nextOldestOccurrence = findNextOldestOccurrence(1, '2023-02-14', '2023-02-16', occurrenceDataState.value);

  expect(nextOldestOccurrence).toBe(null);
});

test('ignores occurrences with other habit ids', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: { 1: '2023-02-14' },
    dates: {
      '2023-02-14': { 1: { complete: true, visible: true } },
      '2023-02-15': { 2: { complete: true, visible: true } },
    },
  });

  const nextOldestOccurrence = findNextOldestOccurrence(1, '2023-02-14', '2023-02-16', occurrenceDataState.value);

  expect(nextOldestOccurrence).toBe(null);
});

test('returns the next oldest occurrence', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: { 1: '2023-02-14' },
    dates: {
      '2023-02-14': { 1: { complete: true, visible: true } },
      '2023-02-15': { 1: { complete: true, visible: true } },
      '2023-02-16': { 1: { complete: true, visible: true } },
    },
  });

  const nextOldestOccurrence = findNextOldestOccurrence(1, '2023-02-14', '2023-02-16', occurrenceDataState.value);

  expect(nextOldestOccurrence).toBe('2023-02-15');
});

test('returns the next oldest occurrence if it\'s on the current date', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: { 1: '2023-02-14' },
    dates: {
      '2023-02-14': { 1: { complete: true, visible: true } },
      '2023-02-16': { 1: { complete: true, visible: true } },
    },
  });

  const nextOldestOccurrence = findNextOldestOccurrence(1, '2023-02-14', '2023-02-16', occurrenceDataState.value);

  expect(nextOldestOccurrence).toBe('2023-02-16');
});
