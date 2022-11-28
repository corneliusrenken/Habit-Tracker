import { SelectedOccurrence, OccurrenceData } from '../../globalTypes';
import { getDateFromDateString, getMinimumDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

export default function getSelectedOccurrences(
  occurrenceData: OccurrenceData,
  focusId: number | undefined,
  dateStringLastOfWeek: string,
) {
  const occurences: SelectedOccurrence[] = [];

  const oldestDateString = focusId === undefined
    ? getMinimumDateString(Object.values(occurrenceData.oldest))
    : occurrenceData.oldest[focusId];

  const lastDateOfWeek = getDateFromDateString(dateStringLastOfWeek);
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
