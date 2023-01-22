import {
  DateObject, ListView, OccurrenceData, Streaks,
} from '../../globalTypes';
import getYesterdaysStreaks from './getYesterdaysStreaks';

type States = {
  dateObject: DateObject;
  latchedListView: ListView;
  occurrenceData: OccurrenceData | undefined;
  streaks: Streaks | undefined;
};

export default function getSelectedStreaks(states: States) {
  const {
    dateObject, latchedListView, occurrenceData, streaks,
  } = states;

  if (!occurrenceData || !streaks) return {};

  return latchedListView.name === 'yesterday'
    ? getYesterdaysStreaks(dateObject.today.dateString, { occurrenceData, streaks })
    : streaks;
}
