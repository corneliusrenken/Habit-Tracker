function getYearMonthDay(dateString: string): number[] {
  return dateString.split('-').map(Number);
}

export function getDateStringFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateFromDateString(dateString: string): Date {
  const [year, month, day] = getYearMonthDay(dateString);
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date;
}

export function isDateStringLessThan(dateString1: string, dateString2: string): boolean {
  const [year1, month1, day1] = getYearMonthDay(dateString1);
  const [year2, month2, day2] = getYearMonthDay(dateString2);
  return year2 > year1
  || (year1 === year2 && month2 > month1)
  || (year1 === year2 && month2 === month1 && day2 > day1);
}

export function getMinimumDateString(dateStrings: (string | null)[]): string | null {
  return dateStrings.reduce((minimum, dateString) => {
    if (minimum === null) return dateString;
    if (dateString === null) return minimum;
    if (isDateStringLessThan(dateString, minimum)) return dateString;
    return minimum;
  }, null);
}
