/* eslint-disable no-continue */
import { Database } from 'better-sqlite3';
import {
  addDay,
  addHabit,
  addOccurrences,
  updateOccurrence,
} from './database/queries';

function dateToString(dateObj: Date) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}

/**
 * @param dateString "YYYY-MM-DD"
 */
function stringToDate(dateString: string) {
  const dateObj = new Date();
  dateObj.setTime(0);
  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(5, 7));
  const date = Number(dateString.slice(8));
  dateObj.setFullYear(year);
  dateObj.setMonth(month - 1);
  dateObj.setDate(date);
  return dateObj;
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
