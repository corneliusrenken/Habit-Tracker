/* eslint-disable no-continue */
import { Database } from 'better-sqlite3';
import {
  addDay,
  addHabit,
  addOccurrences,
  updateOccurrence,
} from './database';

function dateToString(dateObj: Date) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}

/**
 * @param dateString "YYYY-MM-DD"
 */
export function stringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date;
}

type Options = {
  loginProbabilityDecimal: number;
  habitCompleteProbabilityDecimal: number;
  habitVisibleProbabilityDecimal: number;
};

/**
 * @param startDate "YYYY-MM-DD"
 */
export default function seedDatabase(
  database: Database,
  startDate: string,
  habitNames: string[],
  options: Options,
) {
  const {
    loginProbabilityDecimal,
    habitCompleteProbabilityDecimal,
    habitVisibleProbabilityDecimal,
  } = options;

  const habitNameToIds: { [habitName: string]: number } = {};

  const currentDate = stringToDate(startDate);
  const finalDate = stringToDate(dateToString(new Date()));

  let init = true;

  while (currentDate <= finalDate) {
    const currentDateString = dateToString(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);

    if (init) {
      init = false;
      addDay(database, currentDateString);
      habitNames.forEach((habitName) => {
        const habitId = addHabit(database, habitName, currentDateString).id;
        habitNameToIds[habitName] = habitId;
      });
      continue;
    }

    const login = Math.random() <= loginProbabilityDecimal;
    if (!login) continue;
    addDay(database, currentDateString);

    habitNames.forEach((habitName) => {
      const complete = Math.random() <= habitCompleteProbabilityDecimal;
      const visible = Math.random() <= habitVisibleProbabilityDecimal;
      if (!complete && !visible) return;
      addOccurrences(database, [habitNameToIds[habitName]], currentDateString);
      updateOccurrence(database, habitNameToIds[habitName], currentDateString, { complete });
      updateOccurrence(database, habitNameToIds[habitName], currentDateString, { visible });
    });
  }
}
