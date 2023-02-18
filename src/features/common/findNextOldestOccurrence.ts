import { OccurrenceData } from '../../globalTypes';
import { getDateFromDateString, getDateStringFromDate } from './dateStringFunctions';

/**
 * @param previousOldestDate YYYY-MM-DD
 * @param currentDate YYYY-MM-DD
 */
export default function findNextOldestOccurrence(
  habitId: number,
  previousOldestDate: string,
  currentDate: string,
  occurrenceData: OccurrenceData | undefined,
) {
  if (!occurrenceData) throw new Error('state should not be undefined');

  if (occurrenceData.oldest[habitId] === undefined) {
    throw new Error('no oldest occurrence entry exists for the given habit id');
  }

  const currentDateObject = getDateFromDateString(currentDate);
  const nextOldestDateObject = getDateFromDateString(previousOldestDate);
  nextOldestDateObject.setDate(nextOldestDateObject.getDate() + 1);

  while (nextOldestDateObject <= currentDateObject) {
    const dateString = getDateStringFromDate(nextOldestDateObject);
    if (
      occurrenceData.dates[dateString]
      && occurrenceData.dates[dateString][habitId]
      && occurrenceData.dates[dateString][habitId].visible
    ) {
      return dateString;
    }

    nextOldestDateObject.setDate(nextOldestDateObject.getDate() + 1);
  }

  return null;
}
