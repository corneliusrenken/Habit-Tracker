import { OccurrenceData, Streaks } from '../../../globalTypes';
import { updateOccurrenceClient } from '../clientSideFunctions';

type States = {
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
};

/**
 * @param occurrenceDate YYYY-MM-DD
 * @param currentDate YYYY-MM-DD
 */
export default function updateOccurrenceCompleted(
  habitId: number,
  complete: boolean,
  occurrenceDate: string,
  currentDate: string,
  states: States,
) {
  updateOccurrenceClient(habitId, occurrenceDate, currentDate, { complete }, states);
}
