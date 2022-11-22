// for date string in format YYYY-MM-DD

function getYearMonthDay(dateString: string): number[] {
  return dateString.split('-').map(Number);
}

// console.log('2022-11-21');

export function getDateFromDateString(dateString: string): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [year, month, day] = getYearMonthDay(dateString);
  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  return date;
}

// console.log(getDateFromDateString('2010-10-10'));
// console.log(getDateFromDateString('2010-10-10').toLocaleString());
// console.log(getCustomDateString(getDateFromDateString('2010-10-10')));

export function isDateStringLessThan(dateString1: string, dateString2: string): boolean {
  const [year1, month1, day1] = getYearMonthDay(dateString1);
  const [year2, month2, day2] = getYearMonthDay(dateString2);
  return year2 > year1
  || (year1 === year2 && month2 > month1)
  || (year1 === year2 && month2 === month1 && day2 > day1);
}

// console.log(isDateStringLessThan('2022-11-21', '2022-11-21') === false);
// console.log(isDateStringLessThan('2022-11-21', '2021-11-21') === false);
// console.log(isDateStringLessThan('2022-11-21', '2022-10-21') === false);
// console.log(isDateStringLessThan('2022-11-21', '2022-11-20') === false);
// console.log(isDateStringLessThan('2021-11-21', '2022-11-21') === true);
// console.log(isDateStringLessThan('2022-10-21', '2022-11-21') === true);
// console.log(isDateStringLessThan('2022-11-20', '2022-11-21') === true);

export function getMinimumDateString(dateStrings: (string | undefined)[]): string | undefined {
  return dateStrings.reduce((minimum, dateString) => {
    if (minimum === undefined) return dateString;
    if (dateString === undefined) return minimum;
    if (isDateStringLessThan(dateString, minimum)) return dateString;
    return minimum;
  }, undefined);
}

// console.log(getMinimumDateString([]));

// console.log(getMinimumDateString([
//   undefined,
//   '2022-11-21',
//   undefined,
// ]) === '2022-11-21');

// console.log(getMinimumDateString([
//   '2022-11-21',
//   undefined,
// ]) === '2022-11-21');

// console.log(getMinimumDateString([
//   '2022-11-21',
//   '2022-11-20',
// ]) === '2022-11-20');

// console.log(getMinimumDateString([
//   undefined,
//   '2022-11-21',
//   undefined,
//   undefined,
//   '2022-10-20',
//   '2021-10-20',
//   undefined,
// ]) === '2021-10-20');
