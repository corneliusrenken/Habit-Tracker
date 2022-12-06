import { DateObject, OccurrenceData, Streaks } from '../../globalTypes';
import getYesterdaysStreaks from './getYesterdaysStreaks';

type States = {
  dateObject: DateObject;
  displayingYesterday: boolean;
  occurrenceData: OccurrenceData | undefined;
  streaks: Streaks | undefined;
};

export default function getSelectedStreaks(states: States) {
  const {
    dateObject, displayingYesterday, occurrenceData, streaks,
  } = states;

  if (!occurrenceData || !streaks) return {};

  return !displayingYesterday
    ? streaks
    : getYesterdaysStreaks(dateObject.today.dateString, { occurrenceData, streaks });
}
