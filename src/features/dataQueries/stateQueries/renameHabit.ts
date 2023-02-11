import { Habit } from '../../../globalTypes';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
};

export default function renameHabit(
  habitId: number,
  name: string,
  states: States,
) {
  const { setHabits } = states;

  setHabits((oldHabits) => {
    if (oldHabits.find(({ id }) => id === habitId) === undefined) {
      throw new Error('habit with this id doesn\'t exist');
    }

    return oldHabits.map((habit) => {
      if (habit.id !== habitId) return habit;
      return {
        ...habit,
        name,
      };
    });
  });
}
