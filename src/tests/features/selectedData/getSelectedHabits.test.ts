import { getDateFromDateString } from '../../../features/common/dateStringFunctions';
import getDateObject from '../../../features/common/getDateObject';
import getSelectedHabits from '../../../features/selectedData/getSelectedHabits';
import {
  OccurrenceData,
  Habit,
  DateObject,
} from '../../../globalTypes';
import PseudoUseState from '../helperFunctions/pseudoUseState';

let habitState: PseudoUseState<Habit[] | undefined>;
let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;
let dateObject: DateObject;

beforeEach(() => {
  habitState = new PseudoUseState<Habit[] | undefined>([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
    { id: 4, name: 'code' },
  ]);

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: null,
    },
    dates: {},
  });

  dateObject = getDateObject(6, getDateFromDateString('2023-02-14'));
});

test('returns an empty array if the habits state is undefined', () => {
  habitState.setState(undefined);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'today' },
  })).toEqual([]);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'yesterday' },
  })).toEqual([]);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'selection' },
  })).toEqual([]);
});

test('returns an empty array if the occurrenceData state is undefined', () => {
  occurrenceDataState.setState(undefined);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'today' },
  })).toEqual([]);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'yesterday' },
  })).toEqual([]);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'selection' },
  })).toEqual([]);
});

test('returns an empty array for today and yesterday view if no visible occurrences exist on the respective date', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: null,
    },
    dates: {
      '2023-02-13': {
        1: { complete: false, visible: false },
        2: { complete: true, visible: false },
      },
      '2023-02-14': {
        1: { complete: false, visible: false },
        2: { complete: true, visible: false },
      },
    },
  });

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'today' },
  })).toEqual([]);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'yesterday' },
  })).toEqual([]);
});

test('returns an empty array for today and yesterday view if no day entry exists on the respective date', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: null,
    },
    dates: {},
  });

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'today' },
  })).toEqual([]);

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'yesterday' },
  })).toEqual([]);
});

test('returns all habits in \'selection\' view, regardless of their visibility on the current date, in the same order as they exist in the habit state', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: '2023-02-14',
    },
    dates: {
      '2023-02-14': {
        1: { complete: false, visible: false },
        2: { complete: false, visible: true },
        3: { complete: true, visible: false },
        4: { complete: true, visible: true },
      },
    },
  });

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'selection' },
  })).toEqual([
    { id: 1, name: 'exercise' },
    { id: 2, name: 'read' },
    { id: 3, name: 'sleep' },
    { id: 4, name: 'code' },
  ]);
});

test('returns all habits that were visible on today\'s date in \'today\' view, in the same order as they exist in the habit state', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: '2023-02-14',
    },
    dates: {
      '2023-02-14': {
        1: { complete: false, visible: false },
        2: { complete: false, visible: true },
        3: { complete: true, visible: false },
        4: { complete: true, visible: true },
      },
    },
  });

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'today' },
  })).toEqual([
    { id: 2, name: 'read' },
    { id: 4, name: 'code' },
  ]);
});

test('returns all habits that were visible on yesterday\'s date in \'yesterday\' view, in the same order as they exist in the habit state', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: '2023-02-13',
    },
    dates: {
      '2023-02-13': {
        1: { complete: false, visible: false },
        2: { complete: false, visible: true },
        3: { complete: true, visible: false },
        4: { complete: true, visible: true },
      },
    },
  });

  expect(getSelectedHabits({
    habits: habitState.value,
    occurrenceData: occurrenceDataState.value,
    dateObject,
    listView: { name: 'yesterday' },
  })).toEqual([
    { id: 2, name: 'read' },
    { id: 4, name: 'code' },
  ]);
});
