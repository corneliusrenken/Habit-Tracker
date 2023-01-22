import {
  SelectedOccurrence, OccurrenceData, DateObject, OccurrenceView,
} from '../../globalTypes';
import { getDateFromDateString, getMinimumDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

type States = {
  occurrenceData: OccurrenceData | undefined,
  dateObject: DateObject,
  latchedOccurrenceView: OccurrenceView,
};

export default function getSelectedOccurrences(states: States) {
  const {
    occurrenceData,
    dateObject,
    latchedOccurrenceView,
  } = states;

  if (!occurrenceData) return [];

  const occurences: SelectedOccurrence[] = [];

  const oldestDateString = latchedOccurrenceView.name === 'history'
    ? getMinimumDateString(Object.values(occurrenceData.oldest))
    : occurrenceData.oldest[latchedOccurrenceView.focusId];

  const lastDateOfWeek = getDateFromDateString(dateObject.today.weekDateStrings[6]);
  const oldestDate = oldestDateString === null
    ? null
    : getDateFromDateString(oldestDateString);

  const currentDate = new Date(lastDateOfWeek);

  while (
    occurences.length < 7
    || occurences.length % 7 !== 0
    || (oldestDate !== null && currentDate.getTime() >= oldestDate.getTime())
  ) {
    const dateString = getCustomDateString(currentDate);
    let done = false;
    if (occurrenceData.dates[dateString] !== undefined) {
      const occurrenceValues = Object.values(occurrenceData.dates[dateString]);
      if (occurrenceValues.length !== 0) {
        done = latchedOccurrenceView.name === 'history'
          ? occurrenceValues.every((value) => value === true)
          : occurrenceData.dates[dateString][latchedOccurrenceView.focusId] === true;
      }
    }
    const occurence = { date: Number(dateString.slice(-2)), done };
    occurences.push(occurence);
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return occurences.reverse();
}
