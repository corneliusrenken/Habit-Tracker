import { Habit, View } from '../../../globalTypes';
import scrollSelectedIndexIntoView from '../helpers/scrollSelectedIndexIntoView';

type States = {
  view: View;
  selectedHabits: Habit[];
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function incrementSelectedIndex(
  increment: 1 | -1,
  {
    view,
    selectedHabits,
    setInInput,
    setSelectedIndex,
  }: States,
) {
  setSelectedIndex((oldIndex) => {
    let newIndex: number | null;

    if (oldIndex === null) {
      if (view.name === 'selection') {
        newIndex = 0;
      } else {
        newIndex = null;
      }
    } else if (selectedHabits.length === 0 && view.name === 'selection') {
      newIndex = null;
    } else if (increment === 1) {
      const maxIndex = view.name === 'selection' ? selectedHabits.length : selectedHabits.length - 1;
      newIndex = oldIndex === null ? 0 : Math.min(oldIndex + 1, maxIndex);
    } else {
      newIndex = Math.max(0, oldIndex - 1);
    }

    if (view.name === 'selection' && newIndex === selectedHabits.length) {
      setInInput(true);
    } else if (newIndex !== oldIndex) {
      setInInput(false);
    }

    if (newIndex !== null) {
      scrollSelectedIndexIntoView(newIndex, { behavior: 'smooth' });
    }
    return newIndex;
  });
}
