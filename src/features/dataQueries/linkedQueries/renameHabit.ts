import { Habit } from '../../../globalTypes';
import renameHabitStateQuery from '../stateQueries/renameHabit';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
};

export default function renameHabit(
  habitId: number,
  name: string,
  states: States,
) {
  window.electron['update-habit']({ habitId, updateData: { name } });
  renameHabitStateQuery(habitId, name, states);
}
