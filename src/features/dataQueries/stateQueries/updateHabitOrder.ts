import { Habit } from '../../../globalTypes';

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
  const { habits, setHabits, setSelectedIndex } = states;

  if (!habits) throw new Error('states should not be undefined');

  const oldOrderInList = habits.find(({ id }) => id === habitId)?.orderInList;

  if (oldOrderInList === undefined) throw new Error('habit with this id doesn\'t exist');

  if (oldOrderInList === newOrderInList) return;

  if (newOrderInList < 0 || newOrderInList >= habits.length) throw new Error('new order value out of range');

  const orderDifference = newOrderInList - oldOrderInList;

  let newHabits: Habit[] = new Array(habits.length);

  habits.forEach((habit) => {
    const { orderInList } = habit;

    if (orderInList === oldOrderInList) {
      newHabits[newOrderInList] = habit;
    } else if (
      orderDifference > 0
      && orderInList > oldOrderInList
      && orderInList <= newOrderInList
    ) {
      newHabits[orderInList - 1] = habit;
    } else if (
      orderDifference < 0
      && orderInList < oldOrderInList
      && orderInList >= newOrderInList
    ) {
      newHabits[orderInList + 1] = habit;
    } else {
      newHabits[orderInList] = habit;
    }
  });

  newHabits = newHabits.map(({ id, name }, index) => ({
    id,
    name,
    orderInList: index,
  }));

  setHabits(newHabits);
  setSelectedIndex(newOrderInList);
}
