import { Habit, View } from '../../../globalTypes';

type States = {
  view: View;
  selectedHabits: Habit[];
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function incrementSelectedIndex(increment: 1 | -1, states: States) {
  const {
    view,
    selectedHabits,
    setInInput,
    setSelectedIndex,
  } = states;

  setSelectedIndex((oldIndex) => {
    let newIndex: number | null;

    if (increment === 1) {
      if (oldIndex === null && (selectedHabits.length !== 0 || view.name === 'selection')) {
        newIndex = 0;
      } else {
        const maxIndex = view.name === 'selection' ? selectedHabits.length : selectedHabits.length - 1;
        newIndex = oldIndex === null ? null : Math.min(oldIndex + 1, maxIndex);
      }
    } else if (oldIndex === null && (selectedHabits.length !== 0 || view.name === 'selection')) {
      newIndex = view.name === 'selection' ? selectedHabits.length : selectedHabits.length - 1;
    } else {
      newIndex = oldIndex === null ? null : Math.max(oldIndex - 1, 0);
    }

    if (newIndex !== oldIndex) {
      setInInput(false);
    }

    return newIndex;
  });
}
