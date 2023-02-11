import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import addHabitStateQuery from '../stateQueries/addHabit';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default async function addHabit(
  name: string,
  todaysDateString: string,
  states: States,
) {
  const addedHabit = await window.electron['add-habit'](name, todaysDateString);
  addHabitStateQuery(name, addedHabit.id, todaysDateString, states);
}
