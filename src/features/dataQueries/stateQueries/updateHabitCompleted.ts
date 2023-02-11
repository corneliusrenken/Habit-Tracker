import { OccurrenceData, Streaks } from '../../../globalTypes';
import { getDateFromDateString } from '../../common/dateStringFunctions';
import getCustomDateString from '../../common/getCustomDateString';
import recalculateStreak from './helperFunctions/recalculateStreak';

type States = {
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function updateHabitCompleted(
  habitId: number,
  completed: boolean,
  dateString: string,
  isYesterday: boolean,
  states: States,
) {
  const {
    streaks, setStreaks, occurrenceData, setOccurrenceData,
  } = states;

  if (!streaks || !occurrenceData) throw new Error('states should not be undefined');

  if (occurrenceData.dates[dateString] === undefined) {
    throw new Error('no date entry exists with the given date string');
  }

  if (occurrenceData.dates[dateString][habitId] === undefined) {
    throw new Error('the date contains no entry for the given habit id');
  }

  const date = getDateFromDateString(dateString);
  date.setDate(date.getDate() + 1);
  const tomorrowDateString = getCustomDateString(date);
  const todayDateString = isYesterday ? tomorrowDateString : dateString;
  const oldOldestOccurrence = occurrenceData.oldest[habitId];
  let newOldestOccurrence: null | string = oldOldestOccurrence;

  if (
    completed && !isYesterday
    && oldOldestOccurrence === null
  ) {
    newOldestOccurrence = dateString;
  } else if (
    completed && isYesterday
    && (oldOldestOccurrence === null || oldOldestOccurrence === todayDateString)
  ) {
    newOldestOccurrence = dateString;
  } else if (
    !completed && !isYesterday
    && oldOldestOccurrence === dateString
  ) {
    newOldestOccurrence = null;
  } else if (
    !completed && isYesterday
  ) {
    if (oldOldestOccurrence === dateString) {
      if (occurrenceData.dates[todayDateString][habitId].complete) {
        newOldestOccurrence = todayDateString;
      } else {
        newOldestOccurrence = null;
      }
    }
  }

  const newOccurrenceData: OccurrenceData = {
    oldest: {
      ...occurrenceData.oldest,
      [habitId]: newOldestOccurrence,
    },
    dates: {
      ...occurrenceData.dates,
      [dateString]: {
        ...occurrenceData.dates[dateString],
        [habitId]: {
          visible: true,
          complete: completed,
        },
      },
    },
  };

  const newStreak = recalculateStreak(habitId, todayDateString, newOccurrenceData);

  const newStreaks: Streaks = {
    ...streaks,
    [habitId]: newStreak,
  };

  setOccurrenceData(newOccurrenceData);
  setStreaks(newStreaks);
}
