import { OccurrenceData, Streaks } from '../../../globalTypes';
import { Task } from '../../taskQueue';
import recalculateStreak from '../../common/recalculateStreak';
import findNextOldestOccurrence from '../../common/findNextOldestOccurrence';
import { getMinimumDateString } from '../../common/dateStringFunctions';

type States = {
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
};

/**
 * @param occurrenceDate YYYY-MM-DD
 * @param currentDate YYYY-MM-DD
 */
export default function updateOccurrenceStateUpdate(
  habitId: number,
  occurrenceDate: string,
  currentDate: string,
  updateData: Task<'update-occurrence'>['args']['updateData'],
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

    newOccurrenceData = JSON.parse(JSON.stringify(previousOccurrenceData));

    newOccurrenceData.dates[occurrenceDate][habitId] = {
      ...newOccurrenceData.dates[occurrenceDate][habitId],
      ...updateData,
    };

    const previousOldestValue = previousOccurrenceData.oldest[habitId];
    let newOldestValue = previousOldestValue;

    if ('visible' in updateData) {
      if (updateData.visible === false) {
        newOldestValue = findNextOldestOccurrence(
          habitId,
          occurrenceDate,
          currentDate,
          newOccurrenceData,
        );
      } else {
        newOldestValue = getMinimumDateString([previousOldestValue, occurrenceDate]);
      }
    }

    newOccurrenceData.oldest[habitId] = newOldestValue;

    return newOccurrenceData;
  });

  setStreaks((previousStreaks) => {
    if (!previousStreaks) throw new Error('state should not be undefined');

    const newStreaks: Streaks = JSON.parse(JSON.stringify(previousStreaks));

    const newStreak = recalculateStreak(habitId, currentDate, newOccurrenceData);

    newStreaks[habitId] = newStreak;

    return newStreaks;
  });
}
