import getTextWidthInPx from './getTextWidthInPx';
import { DateInfo } from './types';

// weekStartOffset 0: week starts on sunday
//                 1: week starts on monday
//                 2: week starts on tuesday
function getWeekDates(date: Date, weekStartOffset: number): Array<Date> {
  const dates = [];
  const weekDay = (date.getDay() + 7 - weekStartOffset) % 7;
  for (let i = 0; i < 7; i += 1) {
    const temp = new Date(date);
    temp.setDate(date.getDate() + i - weekDay);
    dates.push(temp);
  }
  return dates;
}

function getWeekDays(weekStartOffset: number): Array<string> {
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

function getTodaysIndex(date: Date, weekStartOffset: number): number {
  return (date.getDay() + 7 - weekStartOffset) % 7;
}

export function toCustomDateString(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDateInfo(date: Date, weekStartOffset: number): DateInfo {
  console.log('calculating date info');
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  const weekDates = getWeekDates(date, weekStartOffset);
  return {
    today: date,
    todayString: toCustomDateString(date),
    yesterday,
    yesterdayString: toCustomDateString(yesterday),
    weekDates,
    weekDays: getWeekDays(weekStartOffset),
    todaysIndex: getTodaysIndex(date, weekStartOffset),
    firstDateWidthInPx: getTextWidthInPx(weekDates[0].getDate()),
    lastDateWidthInPx: getTextWidthInPx(weekDates[6].getDate()),
  };
}
