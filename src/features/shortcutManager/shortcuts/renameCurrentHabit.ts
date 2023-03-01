import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[];
  selectedIndex: number | null;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function renameCurrentHabit({
  habits,
  selectedIndex,
  setInInput,
}: States) {
  if (selectedIndex === habits.length) return;
  setInInput(true);
}
