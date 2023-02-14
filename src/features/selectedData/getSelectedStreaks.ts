import {
  DateObject, ListView, OccurrenceData, Streaks,
} from '../../globalTypes';
import recalculateStreak from '../common/recalculateStreak';

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

  if (latchedListView.name !== 'yesterday') return streaks;

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
