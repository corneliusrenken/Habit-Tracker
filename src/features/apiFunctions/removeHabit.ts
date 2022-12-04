import axios from 'axios';
import { Habit } from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  selectedIndex: number;
  setSelectedIndex: (newIndex: number) => void;
};

export default function removeHabit(
  habitId: number,
  states: States,
) {
  const {
    habits, setHabits, selectedIndex, setSelectedIndex,
  } = states;

  if (!habits) throw new Error('states should not be undefined');

  axios({
    method: 'delete',
    url: `/api/habits/${habitId}`,
  });

  const newHabits: Habit[] = habits.filter(({ id }) => id !== habitId);

  setHabits(newHabits);
  setSelectedIndex(selectedIndex - 1);
}
