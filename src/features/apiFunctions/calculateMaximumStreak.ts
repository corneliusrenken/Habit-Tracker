import { OccurrenceData } from '../../globalTypes';
import { getDateFromDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

export default function calculateMaximumStreak(
  habitId: number,
  todayDateString: string,
  occurrenceData: OccurrenceData,
) {
  let maximumStreak = 0;

  const oldestDateString = occurrenceData.oldest[habitId];

  if (oldestDateString === null) return 0;

  const oldestDate = getDateFromDateString(oldestDateString);
  const todayDate = getDateFromDateString(todayDateString);

  let currentStreak = 0;

  const currentDate = new Date(oldestDate);

  while (currentDate.getTime() <= todayDate.getTime()) {
    const currentDateString = getCustomDateString(currentDate);
    const occurredToday = occurrenceData.dates[currentDateString]
      && occurrenceData.dates[currentDateString][habitId] === true;

    if (occurredToday) {
      currentStreak += 1;
      maximumStreak = Math.max(maximumStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return maximumStreak;
}

// console.log(calculateMaximumStreak(
//   1,
//   '2022-11-29',
//   {
//     oldest: { 1: '2022-11-20' },
//     dates: {
//       '2022-11-20': { 1: true },
//       '2022-11-21': { 1: false },
//       '2022-11-28': { 1: false },
//       '2022-11-29': { 1: false },
//     },
//   },
// ) === 1);

// console.log(calculateMaximumStreak(
//   1,
//   '2022-11-29',
//   {
//     oldest: { 1: '2022-11-20' },
//     dates: {
//       '2022-11-20': { 1: true },
//       '2022-11-21': { 1: true },
//       '2022-11-28': { 1: false },
//       '2022-11-29': { 1: false },
//     },
//   },
// ) === 2);

// console.log(calculateMaximumStreak(
//   1,
//   '2022-11-29',
//   {
//     oldest: { 1: '2022-11-20' },
//     dates: {
//       '2022-11-20': { 1: true },
//       '2022-11-21': { 1: false },
//       '2022-11-28': { 1: true },
//       '2022-11-29': { 1: true },
//     },
//   },
// ) === 2);

// console.log(calculateMaximumStreak(
//   1,
//   '2022-11-29',
//   {
//     oldest: { 1: '2022-11-20' },
//     dates: {
//       '2022-11-20': { 1: true },
//       '2022-11-21': { 1: true },
//       '2022-11-23': { 1: true },
//     },
//   },
// ) === 2);
