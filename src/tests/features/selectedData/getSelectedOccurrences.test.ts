import { getDateFromDateString, getMinimumDateString } from '../../../features/common/dateStringFunctions';
import getDateObject from '../../../features/common/getDateObject';
import getSelectedOccurrences from '../../../features/selectedData/getSelectedOccurrences';
import {
  DateObject,
  OccurrenceData,
} from '../../../globalTypes';
import PseudoUseState from '../helperFunctions/pseudoUseState';

let occurrenceDataState: PseudoUseState<OccurrenceData | undefined>;
let dateObject: DateObject;

beforeEach(() => {
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

test('returns an empty array if the occurrence state is undefined', () => {
  occurrenceDataState.setState(undefined);

  expect(getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  })).toEqual([]);
});

test('evaluates a date as incomplete if no day entry exists', () => {
  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const today = dateObject.today.dateString;

  const selectedOccurrenceToday = selectedOccurrences.find(({ fullDate }) => fullDate === today);
  expect(selectedOccurrenceToday).not.toBe(undefined);
  expect(selectedOccurrenceToday?.complete).toBe(false);
});

test('evaluates a date as incomplete if no occurrences exist in the day', () => {
  const today = dateObject.today.dateString;

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: null,
      2: null,
      3: null,
      4: null,
    },
    dates: {
      [today]: {},
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const selectedOccurrenceToday = selectedOccurrences.find(({ fullDate }) => fullDate === today);
  expect(selectedOccurrenceToday).not.toBe(undefined);
  expect(selectedOccurrenceToday?.complete).toBe(false);
});

test('only uses visible occurrences to evaluate if a day is complete', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-14',
      2: null,
      3: null,
      4: null,
    },
    dates: {
      '2023-02-13': { 1: { complete: true, visible: false } },
      '2023-02-14': { 1: { complete: true, visible: true } },
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const today = dateObject.today.dateString;
  const yesterday = dateObject.yesterday.dateString;

  const selectedOccurrenceToday = selectedOccurrences.find(
    ({ fullDate }) => fullDate === today,
  );
  const selectedOccurrenceYesterday = selectedOccurrences.find(
    ({ fullDate }) => fullDate === yesterday,
  );

  expect(selectedOccurrenceToday).not.toBe(undefined);
  expect(selectedOccurrenceToday?.complete).toBe(true);
  expect(selectedOccurrenceYesterday).not.toBe(undefined);
  expect(selectedOccurrenceYesterday?.complete).toBe(false);
});

test('the last day in the array is the last day of the week', () => {
  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const lastDay = selectedOccurrences[selectedOccurrences.length - 1];

  expect(lastDay.fullDate).toBe(dateObject.today.weekDateStrings[6]);
});

test('if the current date is a monday, the last day in the array is the last day of last week in yesterday view', () => {
  dateObject = getDateObject(6, getDateFromDateString('2023-02-13'));
  expect(dateObject.today.weekDayIndex).toBe(0);
  expect(dateObject.yesterday.weekDayIndex).toBe(6);

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'yesterday' },
  });

  const lastDay = selectedOccurrences[selectedOccurrences.length - 1];

  expect(lastDay.fullDate).toBe(dateObject.yesterday.weekDateStrings[6]);
});

test('returns at least 7 occurrences in the array, even if no occurrences exist', () => {
  expect(getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  }).length).toEqual(7);
});

test('always returns an occurrence count divisible by 7, including all dates up to the oldest oldest date, filling up the last row with incomplete occurrences if needed', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-10',
      2: '2023-02-14',
      3: null,
      4: null,
    },
    dates: {
      '2023-02-10': { 1: { complete: false, visible: true } },
      '2023-02-14': { 2: { complete: false, visible: true } },
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  expect(selectedOccurrences.length % 7).toEqual(0);
  expect(selectedOccurrences[0].fullDate).not.toEqual('2023-02-10');
  expect(getMinimumDateString([
    selectedOccurrences[0].fullDate,
    '2023-02-10',
  ])).toBe(selectedOccurrences[0].fullDate);
});

test('returns the correct date for each date in a month', () => {
  dateObject = getDateObject(6, getDateFromDateString('2023-01-31'));

  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-01-01',
      2: null,
      3: null,
      4: null,
    },
    dates: {
      '2023-01-01': { 1: { complete: false, visible: true } },
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const indexOfJanuaryFirst = selectedOccurrences.findIndex(
    ({ fullDate }) => fullDate === '2023-01-01',
  );

  for (let date = 1; date <= 31; date += 1) {
    const i = indexOfJanuaryFirst + date - 1;
    expect(selectedOccurrences[i].fullDate).toBe(`2023-01-${date.toString().padStart(2, '0')}`);
    expect(selectedOccurrences[i].date).toBe(date);
  }
});

test('if in any view other than focus, a complete date is evaluated based on all visible occurrences being complete, and there being at least one visible complete occurrence', () => {
  const viewNames = ['today', 'yesterday', 'selection', 'history'] as const;

  viewNames.forEach((viewName) => {
    occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
      oldest: {
        1: '2023-02-07',
        2: '2023-02-10',
        3: null,
        4: null,
      },
      dates: {
        '2023-02-06': {
          1: { complete: false, visible: false }, // not visible -> false
        },
        '2023-02-07': {
          1: { complete: false, visible: true }, // visible but not complete -> false
        },
        '2023-02-08': {
          1: { complete: true, visible: false }, // not visible -> false
        },
        '2023-02-09': {
          1: { complete: true, visible: true }, // visible and complete -> true
        },
        '2023-02-10': {
          1: { complete: false, visible: false },
          2: { complete: true, visible: true }, // only visible is complete -> true
        },
        '2023-02-11': {
          1: { complete: false, visible: true },
          2: { complete: true, visible: true }, // one of visible is incomplete -> false
        },
        '2023-02-12': {
          1: { complete: true, visible: false },
          2: { complete: true, visible: true }, // only visible is complete -> true
        },
        '2023-02-13': {
          1: { complete: true, visible: true },
          2: { complete: true, visible: true }, // all visible are complete -> true
        },
      },
    });

    const selectedOccurrences = getSelectedOccurrences({
      occurrenceData: occurrenceDataState.value,
      dateObject,
      view: { name: viewName },
    });

    const sixthFebruaryIndex = selectedOccurrences.findIndex(
      ({ fullDate }) => fullDate === '2023-02-06',
    );
    const thirteenthFebruaryIndex = selectedOccurrences.findIndex(
      ({ fullDate }) => fullDate === '2023-02-13',
    );

    // from comments above
    const expectedResults = [false, false, false, true, true, false, true, true];

    for (let i = sixthFebruaryIndex; i <= thirteenthFebruaryIndex; i += 1) {
      const expectedResultIndex = i - sixthFebruaryIndex;
      expect(selectedOccurrences[i].complete).toBe(expectedResults[expectedResultIndex]);
    }
  });
});

test('if in focus view, a complete date is evaluated based on the day containing a visibile complete occurrence for the focused habit. The occurrences array only includes occurrences based on the oldest date of the focused id', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-08',
      2: '2023-02-11',
      3: null,
      4: null,
    },
    dates: {
      '2023-02-07': {
        1: { complete: false, visible: false },
      },
      '2023-02-08': {
        1: { complete: false, visible: true },
      },
      '2023-02-09': {
        1: { complete: true, visible: false },
      },
      '2023-02-10': {
        1: { complete: true, visible: true },
      },
      '2023-02-11': {
        1: { complete: false, visible: false },
        2: { complete: true, visible: true }, // visible and complete -> true
      },
      '2023-02-12': {
        1: { complete: false, visible: true },
        2: { complete: false, visible: false }, // not visible -> false
      },
      '2023-02-13': {
        1: { complete: true, visible: false },
        2: { complete: false, visible: true }, // not complete -> false
      },
      '2023-02-14': {
        1: { complete: true, visible: true },
        2: { complete: true, visible: false }, // not visible -> false
      },
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'focus', focusId: 2 },
  });

  const eleventhFebruaryIndex = selectedOccurrences.findIndex(
    ({ fullDate }) => fullDate === '2023-02-11',
  );

  selectedOccurrences.forEach(({ complete }, i) => {
    if (i === eleventhFebruaryIndex) {
      expect(complete).toBe(true);
    } else {
      expect(complete).toBe(false);
    }
  });
});

test('includes occurrences that happen after today\'s date, but only if they are within the current week', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-14',
      2: null,
      3: null,
      4: null,
    },
    dates: {
      '2023-02-14': {
        1: { complete: true, visible: true },
      },
      '2023-02-15': {
        1: { complete: true, visible: true },
      },
      '2023-02-20': {
        1: { complete: true, visible: true },
      },
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const fourteenthFebruaryOccurrence = selectedOccurrences.find(
    ({ fullDate }) => fullDate === '2023-02-14',
  );

  const fifteenthFebruaryOccurrence = selectedOccurrences.find(
    ({ fullDate }) => fullDate === '2023-02-15',
  );

  const twentyFebruaryOccurrence = selectedOccurrences.find(
    ({ fullDate }) => fullDate === '2023-02-20',
  );

  expect(fourteenthFebruaryOccurrence).not.toBe(undefined);
  expect(fourteenthFebruaryOccurrence?.complete).toBe(true);
  expect(fifteenthFebruaryOccurrence).not.toBe(undefined);
  expect(fifteenthFebruaryOccurrence?.complete).toBe(true);
  expect(twentyFebruaryOccurrence).toBe(undefined);
});

test('if the only oldest date is newer than today\'s date, ignores the oldest date and returns 7 occurrences as if no oldest date existed', () => {
  occurrenceDataState = new PseudoUseState<OccurrenceData | undefined>({
    oldest: {
      1: '2023-02-20',
      2: null,
      3: null,
      4: null,
    },
    dates: {
      '2023-02-20': {
        1: { complete: true, visible: true },
      },
    },
  });

  const selectedOccurrences = getSelectedOccurrences({
    occurrenceData: occurrenceDataState.value,
    dateObject,
    view: { name: 'today' },
  });

  const lastOccurrenceFullDate = selectedOccurrences[selectedOccurrences.length - 1].fullDate;
  const lastOfWeekFullDate = dateObject.today.weekDateStrings[6];

  expect(lastOccurrenceFullDate).toBe(lastOfWeekFullDate);

  const twentyFebruaryOccurrence = selectedOccurrences.find(
    ({ fullDate }) => fullDate === '2023-02-20',
  );
  expect(twentyFebruaryOccurrence).toBe(undefined);
});
