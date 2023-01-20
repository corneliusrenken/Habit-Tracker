import { OccurrenceData, Streaks } from '../../globalTypes';

type States = {
  streaks: Streaks;
  occurrenceData: OccurrenceData;
};

export default function getYesterdaysStreaks(todaysDateString: string, states: States):Streaks {
  const { streaks, occurrenceData } = states;
  const habitIds = Object.keys(streaks);
  const todaysOccurrences = occurrenceData.dates[todaysDateString];

  const yesterdaysStreaks: Streaks = {};

  habitIds.forEach((habitId) => {
    yesterdaysStreaks[habitId] = { ...streaks[habitId] };

    if (todaysOccurrences[habitId] === true) {
      yesterdaysStreaks[habitId].current = Math.max(0, streaks[habitId].current - 1);
    }
  });

  return yesterdaysStreaks;
}
