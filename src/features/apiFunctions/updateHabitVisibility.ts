import axios from 'axios';
import { OccurrenceData, Streaks } from '../../globalTypes';
import recalculateStreak from './recalculateStreak';

type States = {
  streaks: Streaks;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function updateHabitVisibility(
  habitId: number,
  visible: boolean,
  todayDateString: string,
  states: States,
) {
  const {
    streaks, setStreaks, occurrenceData, setOccurrenceData,
  } = states;

  if (!streaks || !occurrenceData) throw new Error('states should not be undefined');

  const newTodaysOccurrencesToday = { ...occurrenceData.dates[todayDateString] };

  const oldOldestOccurrence = occurrenceData.oldest[habitId];
  let newOldestOccurrence: string | null = oldOldestOccurrence;

  if (visible) {
    axios({
      method: 'post',
      url: '/api/occurrences',
      data: {
        occurrences: [
          { habitId, completed: false, dateString: todayDateString },
        ],
      },
    });

    newTodaysOccurrencesToday[habitId] = false;
  } else {
    axios({
      method: 'delete',
      url: `/api/occurrences/${habitId}/${todayDateString}`,
    });

    if (newTodaysOccurrencesToday[habitId] === true) {
      if (oldOldestOccurrence === todayDateString) {
        newOldestOccurrence = null;
      }
    }

    delete newTodaysOccurrencesToday[habitId];
  }

  const newOccurrenceData: OccurrenceData = {
    oldest: {
      ...occurrenceData.oldest,
      [habitId]: newOldestOccurrence,
    },
    dates: {
      ...occurrenceData.dates,
      [todayDateString]: newTodaysOccurrencesToday,
    },
  };

  const newStreak = recalculateStreak(habitId, todayDateString, newOccurrenceData);

  const newStreaks: Streaks = {
    ...streaks,
    [habitId]: newStreak,
  };

  setStreaks(newStreaks);
  setOccurrenceData(newOccurrenceData);
}
