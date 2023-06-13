import { Habit } from '../../../globalTypes';
import scrollSelectedIndexIntoView from '../helpers/scrollSelectedIndexIntoView';

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
  if (selectedIndex === habits.length || selectedIndex === null) return;
  setInInput(true);
  scrollSelectedIndexIntoView(selectedIndex, { behavior: 'instant' });
}
