import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { updateHabitClient } from '../clientSideFunctions';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function renameHabit(
  habitId: number,
  name: string,
  states: States,
) {
  updateHabitClient(habitId, { name }, states);
}
