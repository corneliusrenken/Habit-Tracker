import axios from 'axios';
import { Habit } from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setSelectedIndex: (newIndex: number | null) => void;
};

export default function updateHabitOrder(
  habitId: number,
  newOrder: number,
  states: States,
) {
  const { habits, setHabits, setSelectedIndex } = states;

  if (!habits) throw new Error('states should not be undefined');

  const oldOrder = habits.find(({ id }) => id === habitId)?.order;

  if (oldOrder === undefined) throw new Error('habit with this id doesn\'t exist');

  if (oldOrder === newOrder) return;

  if (newOrder < 0 || newOrder >= habits.length) throw new Error('new order value out of range');

  axios({
    method: 'patch',
    url: `/api/habits/${habitId}`,
    data: {
      order: newOrder,
    },
  });

  const orderDifference = newOrder - oldOrder;

  let newHabits: Habit[] = new Array(habits.length);

  habits.forEach((habit) => {
    const { order } = habit;

    if (order === oldOrder) {
      newHabits[newOrder] = habit;
    } else if (orderDifference > 0 && order > oldOrder && order <= newOrder) {
      newHabits[order - 1] = habit;
    } else if (orderDifference < 0 && order < oldOrder && order >= newOrder) {
      newHabits[order + 1] = habit;
    } else {
      newHabits[order] = habit;
    }
  });

  newHabits = newHabits.map((habit, index) => ({ ...habit, order: index }));

  setHabits(newHabits);
  setSelectedIndex(newOrder);
}
