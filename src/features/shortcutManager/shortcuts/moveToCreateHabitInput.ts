import { Habit } from '../../../globalTypes';

type States = {
  habits: Habit[];
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function moveToCreateHabitInput({
  habits,
  setInInput,
  setSelectedIndex,
}: States) {
  setSelectedIndex(habits.length);
  setInInput(true);
}
