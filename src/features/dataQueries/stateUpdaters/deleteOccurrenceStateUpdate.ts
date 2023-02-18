import findNextOldestOccurrence from '../../common/findNextOldestOccurrence';
import { OccurrenceData, Streaks } from '../../../globalTypes';
import recalculateStreak from '../../common/recalculateStreak';

type States = {
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
};

/**
 * @param occurrenceDate YYYY-MM-DD
 * @param currentDate YYYY-MM-DD
 */
export default function deleteOccurrenceStateUpdate(
  habitId: number,
  occurrenceDate: string,
  currentDate: string,
  states: States,
) {
  const { setOccurrenceData, setStreaks } = states;

  let newOccurrenceData: OccurrenceData;

  setOccurrenceData((previousOccurrenceData) => {
    if (!previousOccurrenceData) throw new Error('state should not be undefined');

    if (previousOccurrenceData.dates[occurrenceDate] === undefined) {
      throw new Error('day entry does not exist for given date');
    }

    if (previousOccurrenceData.dates[occurrenceDate][habitId] === undefined) {
      throw new Error('occurrence does not exist for given date and habit id');
    }

    if (previousOccurrenceData.oldest[habitId] === undefined) {
      throw new Error('oldest occurrence does not exist for given date and habit id');
    }

    newOccurrenceData = JSON.parse(JSON.stringify(previousOccurrenceData));

    delete newOccurrenceData.dates[occurrenceDate][habitId];

    const previousOldestDate = previousOccurrenceData.oldest[habitId];

    if (previousOldestDate === occurrenceDate) {
      newOccurrenceData.oldest[habitId] = findNextOldestOccurrence(
        habitId,
        previousOldestDate,
        currentDate,
        newOccurrenceData,
      );
    } else {
      newOccurrenceData.oldest[habitId] = previousOldestDate;
    }

    return newOccurrenceData;
  });

  setStreaks((previousStreaks) => {
    if (!previousStreaks) throw new Error('state should not be undefined');

    const newStreaks: Streaks = JSON.parse(JSON.stringify(previousStreaks));

    newStreaks[habitId] = recalculateStreak(habitId, currentDate, newOccurrenceData);

    return newStreaks;
  });
}
