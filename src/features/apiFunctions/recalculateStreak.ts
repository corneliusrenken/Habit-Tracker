import { OccurrenceData, Streaks } from '../../globalTypes';
import { getDateFromDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

export default function recalculateStreak(
  habitId: number,
  todayDateString: string,
  occurrenceData: OccurrenceData,
): Streaks[string] {
  let maximumStreak = 0;
  let currentStreak = 0;

  const oldestDateString = occurrenceData.oldest[habitId];

  if (oldestDateString === null) return { current: currentStreak, maximum: maximumStreak };

  const oldestDate = getDateFromDateString(oldestDateString);
  const todayDate = getDateFromDateString(todayDateString);

  const currentDate = new Date(oldestDate);

  while (currentDate.getTime() <= todayDate.getTime()) {
    const isToday = currentDate.getTime() === todayDate.getTime();
    const currentDateString = getCustomDateString(currentDate);
    const occurredToday = occurrenceData.dates[currentDateString]
      && occurrenceData.dates[currentDateString][habitId]
      && occurrenceData.dates[currentDateString][habitId].complete
      && occurrenceData.dates[currentDateString][habitId].visible;

    if (occurredToday) {
      currentStreak += 1;
      maximumStreak = Math.max(maximumStreak, currentStreak);
    } else if (!isToday) {
      currentStreak = 0;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { current: currentStreak, maximum: maximumStreak };
}
