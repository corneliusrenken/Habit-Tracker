import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[];
  selectedIndex: number | null;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function renameCurrentHabit(states: States) {
  const {
    habits,
    selectedIndex,
    setInInput,
  } = states;

  if (selectedIndex === habits.length) return;
  setInInput(true);
}
