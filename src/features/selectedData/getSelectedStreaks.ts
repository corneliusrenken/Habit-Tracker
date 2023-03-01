import {
  DateObject, ListView, OccurrenceData, Streaks,
} from '../../globalTypes';
import recalculateStreak from '../common/recalculateStreak';

type States = {
  dateObject: DateObject;
  listView: ListView;
  occurrenceData: OccurrenceData;
  streaks: Streaks;
};

export default function getSelectedStreaks({
  dateObject,
  listView,
  occurrenceData,
  streaks,
}: States) {
  if (listView.name !== 'yesterday') return streaks;

  const habitIds = Object.keys(streaks).map(Number);

  const yesterdaysStreaks: Streaks = {};

  habitIds.forEach((habitId) => {
    yesterdaysStreaks[habitId] = recalculateStreak(
      habitId,
      dateObject.yesterday.dateString,
      occurrenceData,
    );
  });

  return yesterdaysStreaks;
}
