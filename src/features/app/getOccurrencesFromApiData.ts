import { Occurrence, OccurrencesApiData } from '../../globalTypes';
import { getDateFromDateString, getMinimumDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

export default function getOccurrencesFromApiData(
  apiData: OccurrencesApiData,
  focusId: number | undefined,
  dateStringLastOfWeek: string,
) {
  const occurences: Occurrence[] = [];

  const oldestDateString = focusId === undefined
    ? getMinimumDateString(Object.values(apiData.oldest))
    : apiData.oldest[focusId];

  const lastDateOfWeek = getDateFromDateString(dateStringLastOfWeek);
  const oldestDate = oldestDateString === undefined
    ? undefined
    : getDateFromDateString(oldestDateString);

  const currentDate = new Date(lastDateOfWeek);

  while (
    occurences.length < 7
    || occurences.length % 7 !== 0
    || (oldestDate !== undefined && currentDate.getTime() >= oldestDate.getTime())
  ) {
    const dateString = getCustomDateString(currentDate);
    let complete = false;
    if (apiData.dates[dateString] !== undefined) {
      complete = focusId === undefined
        ? Object.values(apiData.dates[dateString]).every((value) => value === true)
        : apiData.dates[dateString][focusId] === true;
    }
    const occurence = { date: Number(dateString.slice(-2)), complete };
    occurences.push(occurence);
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return occurences.reverse();
}
