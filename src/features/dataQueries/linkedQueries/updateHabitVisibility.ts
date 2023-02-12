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

  console.log(todaysOccurrences);
  console.log(visible);

  if (visible && todaysOccurrences[habitId] === undefined) {
    console.log(1);
    window.electron['add-occurrence'](habitId, todayDateString);
  } else if (visible) {
    console.log(2);
    window.electron['update-occurrence'](habitId, todayDateString, { visible: true });
  } else if (todaysOccurrences[habitId].complete) {
    console.log(3);
    window.electron['update-occurrence'](habitId, todayDateString, { visible: false });
  } else {
    console.log(4);
    window.electron['delete-occurrence'](habitId, todayDateString);
  }
  updateHabitVisibilityStateQuery(habitId, visible, todayDateString, states);
}
