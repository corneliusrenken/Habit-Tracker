import { DateObject } from '../globalTypes';
import getCustomDateString from './getCustomDateString';

function getWeekDays(mondayIndex: number) {
  if (mondayIndex > 6) {
    throw new Error('index of monday has to be inclusively between 0 and 6');
  }
  let weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  if (mondayIndex !== 0) {
    weekDays = weekDays.slice(-mondayIndex).concat(weekDays.slice(0, 7 - mondayIndex));
  }
  return weekDays;
}

function getDayInfo(date: Date, mondayIndex: number) {
  let dayIndex = date.getDay();
  if (mondayIndex !== 1) {
    dayIndex = (dayIndex + 6 - mondayIndex) % 7;
  }
  const weekDateStrings = [];
  for (let i = 0; i < 7; i += 1) {
    const temp = new Date(date);
    temp.setDate(date.getDate() + i - dayIndex);
    weekDateStrings.push(getCustomDateString(temp));
  }
  return {
    dateString: getCustomDateString(date),
    weekDateStrings,
    dayIndex,
  };
}

export default function getDateObject(mondayIndex: number): DateObject {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return {
    today: getDayInfo(now, mondayIndex),
    yesterday: getDayInfo(yesterday, mondayIndex),
    weekDays: getWeekDays(mondayIndex),
  };
}
