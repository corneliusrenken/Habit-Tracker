import { Habit } from '../../../globalTypes';
import scrollSelectedIndexIntoView from '../helpers/scrollSelectedIndexIntoView';

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
  scrollSelectedIndexIntoView(habits.length, { behavior: 'smooth' });
  setInInput(true);
}
