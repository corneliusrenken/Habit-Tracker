import { DateObject, DayObject } from '../globalTypes';
import getCustomDateString from './getCustomDateString';

function rotateArray<ArrayType>(array: ArrayType[], rotationAmt: number): ArrayType[] {
  const rotatedArray: ArrayType[] = new Array(array.length);
  for (let i = 0; i < array.length; i += 1) {
    rotatedArray[(i + rotationAmt) % array.length] = array[i];
  }
  return rotatedArray;
}

function getWeekDayIndex(sundayIndex: number, date: Date): number {
  let weekDayIndex = date.getDay();
  weekDayIndex = (weekDayIndex + sundayIndex) % 7;
  return weekDayIndex;
}

function getWeekDateStrings(weekDayIndex: number, date: Date): string[] {
  const weekDateStrings: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    const tempDate = new Date(date);
    tempDate.setDate(date.getDate() + (i - weekDayIndex));
    weekDateStrings.push(getCustomDateString(tempDate));
  }
  return weekDateStrings;
}

function getWeekDays(sundayIndex: number): string[] {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return rotateArray(weekDays, sundayIndex);
}

function getDayObject(sundayIndex: number, date: Date): DayObject {
  const weekDayIndex = getWeekDayIndex(sundayIndex, date);
  return {
    date: getCustomDateString(date),
    weekDayIndex,
    weekDateStrings: getWeekDateStrings(weekDayIndex, date),
    weekDays: getWeekDays(sundayIndex),
  };
}

export default function getDateObject(sundayIndex: number, date = new Date()): DateObject {
  if (sundayIndex < 0 || sundayIndex > 6) {
    throw new Error('Sunday index needs to be inclusively between 0 and 6');
  }
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return {
    today: getDayObject(sundayIndex, date),
    yesterday: getDayObject(sundayIndex, yesterday),
  };
}
