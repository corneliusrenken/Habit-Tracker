import { Database } from 'better-sqlite3';
import addDay from '../days/addDay';
import getHabits from '../habits/getHabits';
import addOccurrences from '../occurrences/addOccurrences';
import getOccurrencesGroupedByDate from '../occurrences/getOccurrencesGroupedByDate';
import getOccurrenceStreaks from '../occurrences/getOccurrenceStreaks';
import getOldestVisibleOccurrenceDates from '../occurrences/getOldestVisibleOccurrenceDates';

/**
 * @param date "YYYY-MM-DD"
 */
export default function initializeApp(database: Database, date: string) {
  const habits = getHabits(database);
  const occurrencesGroupedByDate = getOccurrencesGroupedByDate(database);
  const streaks = getOccurrenceStreaks(database, date);
  const oldestVisibleOccurrenceDates = getOldestVisibleOccurrenceDates(database);

  if (occurrencesGroupedByDate[date] === undefined) {
    const functionsToRunInTransaction: (() => void)[] = [];

    functionsToRunInTransaction.push(() => addDay(database, date));
    occurrencesGroupedByDate[date] = {};

    const getLastDayBeforeDateStmt = database.prepare('SELECT date FROM days WHERE date < ?');
    const previousDay = getLastDayBeforeDateStmt.get(date);

    if (previousDay !== undefined) {
      const previousDate = previousDay.date;
      const occurrencesOnPrevDate = occurrencesGroupedByDate[previousDate];
      const habitIdsWithVisibleOccurrencesOnPrevDate = Object.keys(occurrencesOnPrevDate)
        .reduce((memo, id) => {
          if (occurrencesOnPrevDate[id].visible) return memo.concat(id);
          return memo;
        }, [] as string[])
        .map(Number);

      functionsToRunInTransaction.push(() => addOccurrences(
        database,
        habitIdsWithVisibleOccurrencesOnPrevDate,
        date,
      ));
      habitIdsWithVisibleOccurrencesOnPrevDate.forEach((id) => {
        occurrencesGroupedByDate[date][id] = { visible: 1, complete: 0 };
      });
    }

    const initializeAppTransaction = database.transaction(() => {
      functionsToRunInTransaction.forEach((func) => func());
    });
    initializeAppTransaction();
  }

  return {
    habits,
    occurrencesGroupedByDate,
    streaks,
    oldestVisibleOccurrenceDates,
  };
}
