import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[];
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function escapeCreateHabitInput({
  habits,
  setInInput,
  setSelectedIndex,
}: States) {
  setInInput(false);
  if (habits.length === 0) {
    setSelectedIndex(null);
  } else {
    setSelectedIndex(habits.length - 1);
  }
}
