import { OccurrenceData, Streaks } from '../../../globalTypes';
import {
  addOccurrenceClient,
  deleteOccurrenceClient,
  updateOccurrenceClient,
} from '../clientSideFunctions';

type States = {
  occurrenceData: OccurrenceData;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
};

/**
 * @param occurrenceDate YYYY-MM-DD
 * @param currentDate YYYY-MM-DD
 */
export default function updateOccurrenceVisibility(
  habitId: number,
  visible: boolean,
  occurrenceDate: string,
  currentDate: string,
  states: States,
) {
  const {
    occurrenceData,
  } = states;
  const occurrencesToday = { ...occurrenceData.dates[occurrenceDate] };

  if (occurrencesToday === undefined) throw new Error('no day entry exists for the given date');

  const habitOccurrenceToday = occurrencesToday[habitId];

  if (visible) {
    if (habitOccurrenceToday === undefined) {
      addOccurrenceClient(habitId, occurrenceDate, states);
    } else {
      updateOccurrenceClient(habitId, occurrenceDate, currentDate, { visible }, states);
    }
  } else {
    if (habitOccurrenceToday === undefined) {
      throw new Error('occurrence doesn\'t exist on the given date');
    } else if (habitOccurrenceToday.complete) {
      updateOccurrenceClient(habitId, occurrenceDate, currentDate, { visible }, states);
    } else {
      deleteOccurrenceClient(habitId, occurrenceDate, currentDate, states);
    }
  }
}
