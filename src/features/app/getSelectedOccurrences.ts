import { SelectedOccurrence, OccurrenceData, DayObject } from '../../globalTypes';
import { getDateFromDateString, getMinimumDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

type States = {
  occurrenceData: OccurrenceData | undefined,
  focusId: number | undefined,
  dayObject: DayObject,
};

export default function getSelectedOccurrences(states: States) {
  const { occurrenceData, focusId, dayObject } = states;

  if (!occurrenceData) return [];

  const occurences: SelectedOccurrence[] = [];

  const oldestDateString = focusId === undefined
    ? getMinimumDateString(Object.values(occurrenceData.oldest))
    : occurrenceData.oldest[focusId];

  const lastDateOfWeek = getDateFromDateString(dayObject.weekDateStrings[6]);
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
        done = focusId === undefined
          ? occurrenceValues.every((value) => value === true)
          : occurrenceData.dates[dateString][focusId] === true;
      }
    }
    const occurence = { date: Number(dateString.slice(-2)), done };
    occurences.push(occurence);
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return occurences.reverse();
}
