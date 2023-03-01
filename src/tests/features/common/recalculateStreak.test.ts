import recalculateStreak from '../../../features/common/recalculateStreak';
import { OccurrenceData } from '../../../globalTypes';
import PseudoUseState from '../helperFunctions/pseudoUseState';

test('throws an error if the habit id does not have an oldest occurrence entry', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: {},
    dates: {},
  });

  expect(() => {
    recalculateStreak(1, '2023-02-10', occurrenceDataState.value);
  }).toThrowError('no oldest occurrence entry exists for the given habit id');
});

test('ignores occurrences that happened after the passed date', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-10' },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: true } },
      '2023-02-20': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 1, maximum: 1,
  });
});

test('returns 0 for streak values if the oldest date is later than the passed date', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-20' },
    dates: { '2023-02-20': { 1: { complete: true, visible: true } } },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 0, maximum: 0,
  });
});

test('returns 0 for streak values if no occurrences exist for the habit', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: null },
    dates: {},
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 0, maximum: 0,
  });
});

test('ignores invisible occurrences when calculating the streak', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-08' },
    dates: {
      '2023-02-08': { 1: { complete: true, visible: true } },
      '2023-02-09': { 1: { complete: true, visible: false } },
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 1, maximum: 1,
  });
});

test('ignores incomplete occurrences when calculating the streak', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-08' },
    dates: {
      '2023-02-08': { 1: { complete: true, visible: true } },
      '2023-02-09': { 1: { complete: false, visible: true } },
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 1, maximum: 1,
  });
});

test('returns the correct maximum and current streak when a shorter one occurred before a longer one', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-07' },
    dates: {
      '2023-02-07': { 1: { complete: true, visible: true } },
      '2023-02-09': { 1: { complete: true, visible: true } },
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 2, maximum: 2,
  });
});

test('returns the correct maximum and current streak when a longer one occurred before a shorter one', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-07' },
    dates: {
      '2023-02-07': { 1: { complete: true, visible: true } },
      '2023-02-08': { 1: { complete: true, visible: true } },
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 1, maximum: 2,
  });
});

test('returns a current streak of 0 if it ended before yesterday', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-08' },
    dates: {
      '2023-02-08': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 0, maximum: 1,
  });
});

test('returns the current streak if it ended yesterday', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-09' },
    dates: {
      '2023-02-09': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 1, maximum: 1,
  });
});

test('returns the current streak if it ended today', () => {
  const occurrenceDataState = new PseudoUseState<OccurrenceData>({
    oldest: { 1: '2023-02-10' },
    dates: {
      '2023-02-10': { 1: { complete: true, visible: true } },
    },
  });

  expect(recalculateStreak(1, '2023-02-10', occurrenceDataState.value)).toEqual({
    current: 1, maximum: 1,
  });
});
