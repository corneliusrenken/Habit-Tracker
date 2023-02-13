import { Habit } from '../../../globalTypes';

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
  const { habits, setHabits, setSelectedIndex } = states;

  if (!habits) throw new Error('states should not be undefined');

  const oldListPosition = habits.findIndex(({ id }) => id === habitId);

  if (oldListPosition === -1) throw new Error('habit with this id doesn\'t exist');

  if (oldListPosition === newListPosition) return;

  if (newListPosition < 0 || newListPosition >= habits.length) throw new Error('new list position value is out of range');

  const positionDifference = newListPosition - oldListPosition;

  const newHabits: Habit[] = new Array(habits.length);

  habits.forEach((habit, listPosition) => {
    if (listPosition === oldListPosition) {
      newHabits[newListPosition] = habit;
    } else if (
      positionDifference > 0
      && listPosition > oldListPosition
      && listPosition <= newListPosition
    ) {
      newHabits[listPosition - 1] = habit;
    } else if (
      positionDifference < 0
      && listPosition < oldListPosition
      && listPosition >= newListPosition
    ) {
      newHabits[listPosition + 1] = habit;
    } else {
      newHabits[listPosition] = habit;
    }
  });

  setHabits(newHabits);
  setSelectedIndex(newListPosition);
}
