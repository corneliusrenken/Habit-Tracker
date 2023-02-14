import { Habit } from '../../../globalTypes';
import deleteHabitStateQuery from '../stateQueries/deleteHabit';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function deleteHabit(
  habitId: number,
  states: States,
) {
  window.electron['delete-habit'](habitId);
  deleteHabitStateQuery(habitId, states);
}
