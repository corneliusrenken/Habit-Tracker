import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[];
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function moveToCreateHabitInput(states: States) {
  const {
    habits,
    setInInput,
    setSelectedIndex,
  } = states;
  setSelectedIndex(habits.length);
  setInInput(true);
}
