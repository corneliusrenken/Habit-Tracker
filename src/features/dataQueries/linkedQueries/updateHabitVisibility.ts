import { OccurrenceData, Streaks } from '../../../globalTypes';
import updateHabitVisibilityStateQuery from '../stateQueries/updateHabitVisibility';

type States = {
  streaks: Streaks | undefined;
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
    streaks, occurrenceData,
  } = states;

  if (!streaks || !occurrenceData) throw new Error('states should not be undefined');

  // will refactor later
  // will refactor later
  // will refactor later
  // will refactor later

  const todaysOccurrences = { ...occurrenceData.dates[todayDateString] };

  if (visible && todaysOccurrences[habitId] === undefined) {
    window.electron['add-occurrence']({ habitId, date: todayDateString });
  } else if (visible) {
    window.electron['update-occurrence']({ habitId, date: todayDateString, updateData: { visible: true } });
  } else if (todaysOccurrences[habitId].complete) {
    window.electron['update-occurrence']({ habitId, date: todayDateString, updateData: { visible: false } });
  } else {
    window.electron['delete-occurrence']({ habitId, date: todayDateString });
  }
  updateHabitVisibilityStateQuery(habitId, visible, todayDateString, states);
}
