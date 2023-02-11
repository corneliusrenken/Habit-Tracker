import { OccurrenceData, Streaks } from '../../../globalTypes';
import updateHabitCompletedStateQuery from '../stateQueries/updateHabitCompleted';

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
  window.electron['update-occurrence'](habitId, dateString, { complete: completed });
  updateHabitCompletedStateQuery(habitId, completed, dateString, isYesterday, states);
}
