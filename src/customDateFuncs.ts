// weekStartOffset 0: week starts on sunday
//                 1: week starts on monday
//                 2: week starts on tuesday
export function getWeekDates(date: Date, weekStartOffset: number): Array<number> {
  const dates = [];
  const weekDay = date.getDay();
  for (let i = 0; i < 7; i += 1) {
    const temp = new Date(date);
    temp.setDate(date.getDate() + i - weekDay + weekStartOffset);
    dates.push(temp.getDate());
  }
  return dates;
}

export function getWeekDays(weekStartOffset: number): Array<string> {
  const dayIndexToDayString = [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
  ];

  const days = [];
  for (let i = 0; i < 7; i += 1) {
    days.push(dayIndexToDayString[(i + weekStartOffset) % 7]);
  }
  return days;
}

export function getTodaysIndex(date: Date, weekStartOffset: number): number {
  return (date.getDay() + 7 - weekStartOffset) % 7;
}

export function toCustomDateString(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}
