import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function moveToCreateHabitInput(states: States) {
  const {
    habits,
    setInInput,
    setSelectedIndex,
  } = states;
  if (habits === undefined) throw new Error('state should not be undefined');

  setSelectedIndex(habits.length);
  setInInput(true);
}
