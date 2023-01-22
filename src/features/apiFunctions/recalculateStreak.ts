import { OccurrenceData } from '../../globalTypes';
import { getDateFromDateString } from '../common/dateStringFunctions';
import getCustomDateString from '../common/getCustomDateString';

export default function recalculateStreak(
  habitId: number,
  todayDateString: string,
  occurrenceData: OccurrenceData,
): { current: number, maximum: number } {
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
      && occurrenceData.dates[currentDateString][habitId] === true;

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

// const test1 = recalculateStreak(
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
// );

// // doesn't forget maximum streak
// console.log(test1.current === 0 && test1.maximum === 1);

// const test2 = recalculateStreak(
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
// );

// // increments maximum streak
// console.log(test2.current === 0 && test2.maximum === 2);

// const test3 = recalculateStreak(
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
// );

// // chooses the greater of two streaks, recognizes current streak leading up to today
// console.log(test3.current === 2 && test3.maximum === 2);

// const test4 = recalculateStreak(
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
// );

// // recognizes gap in streak
// console.log(test4.current === 0 && test4.maximum === 2);

// const test5 = recalculateStreak(
//   1,
//   '2022-11-29',
//   {
//     oldest: { 1: '2022-11-20' },
//     dates: {
//       '2022-11-20': { 1: true },
//       '2022-11-27': { 1: true },
//       '2022-11-28': { 1: true },
//     },
//   },
// );

// // recognizes current streak leading up to YESTERDAY
// console.log(test5.current === 2 && test5.maximum === 2);
