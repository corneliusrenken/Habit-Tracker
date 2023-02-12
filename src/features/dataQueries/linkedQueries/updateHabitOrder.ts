import { Habit } from '../../../globalTypes';
import updateHabitOrderStateQuery from '../stateQueries/updateHabitOrder';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function updateHabitOrder(
  habitId: number,
  newOrderInList: number,
  states: States,
) {
  window.electron['update-habit'](habitId, { orderInList: newOrderInList });
  updateHabitOrderStateQuery(habitId, newOrderInList, states);
}
