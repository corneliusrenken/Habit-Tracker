import { Habit } from '../../../globalTypes';
import updateHabitListPositionStateQuery from '../stateQueries/updateHabitListPosition';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function updateHabitListPosition(
  habitId: number,
  newListPosition: number,
  states: States,
) {
  window.electron['update-habit'](habitId, { listPosition: newListPosition });
  updateHabitListPositionStateQuery(habitId, newListPosition, states);
}
