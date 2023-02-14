import { OccurrenceData, Streaks } from '../../globalTypes';
import { getDateFromDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

export default function getYesterdaysStreaks(
  yesterdayDateString: string,
  occurrenceData: OccurrenceData,
): Streaks {
  const yesterdaysStreaks: Streaks = {};

  const habitIds = Object.keys(occurrenceData.oldest);

  habitIds.forEach((habitId) => {
    let maximumStreak = 0;
    let currentStreak = 0;

    const oldestDateString = occurrenceData.oldest[habitId];

    if (oldestDateString === null) {
      yesterdaysStreaks[habitId] = { current: currentStreak, maximum: maximumStreak };
      return;
    }

    const oldestDate = getDateFromDateString(oldestDateString);
    const yesterdayDate = getDateFromDateString(yesterdayDateString);

    const currentDate = new Date(oldestDate);

    while (currentDate.getTime() <= yesterdayDate.getTime()) {
      const isYesterday = currentDate.getTime() === yesterdayDate.getTime();
      const currentDateString = getCustomDateString(currentDate);
      const occurredToday = occurrenceData.dates[currentDateString]
        && occurrenceData.dates[currentDateString][habitId]
        && occurrenceData.dates[currentDateString][habitId].complete
        && occurrenceData.dates[currentDateString][habitId].visible;

      if (occurredToday) {
        currentStreak += 1;
        maximumStreak = Math.max(maximumStreak, currentStreak);
      } else if (!isYesterday) {
        currentStreak = 0;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    yesterdaysStreaks[habitId] = { current: currentStreak, maximum: maximumStreak };
  });

  return yesterdaysStreaks;
}
