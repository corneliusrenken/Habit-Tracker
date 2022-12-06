import axios from 'axios';
import { Habit } from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  selectedIndex: number | null;
  setSelectedIndex: (newIndex: number | null) => void;
};

export default function removeHabit(
  habitId: number,
  states: States,
) {
  const {
    habits, setHabits, selectedIndex, setSelectedIndex,
  } = states;

  if (selectedIndex === null) return;

  if (!habits) throw new Error('states should not be undefined');

  axios({
    method: 'delete',
    url: `/api/habits/${habitId}`,
  });

  const newHabits: Habit[] = habits.filter(({ id }) => id !== habitId);

  setHabits(newHabits);
  // will always be able to set selected index to non null value as at least habit form will exist
  setSelectedIndex(Math.max(selectedIndex - 1, 0));
}
