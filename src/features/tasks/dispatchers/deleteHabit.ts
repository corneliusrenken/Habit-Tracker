import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';
import { deleteHabitClient } from '../clientSideFunctions';

type States = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function deleteHabit(
  habitId: number,
  states: States,
) {
  deleteHabitClient(habitId, states);
}
