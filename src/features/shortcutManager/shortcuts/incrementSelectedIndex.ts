import { Habit, View } from '../../../globalTypes';

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
      const marginHeight = Number(
        document.documentElement.style.getPropertyValue('--margin-height').slice(0, -2),
      );
      const selectedListItemPosition = marginHeight + 100 + newIndex * 50 - window.scrollY;
      const selectedItemBounds = {
        top: selectedListItemPosition,
        bottom: selectedListItemPosition + 50,
      };
      const listBounds = {
        top: marginHeight + 100,
        bottom: window.innerHeight - marginHeight,
      };
      let scrollAmount = 0;
      if (selectedItemBounds.top < listBounds.top) {
        scrollAmount = selectedItemBounds.top - listBounds.top;
      }
      if (selectedItemBounds.bottom > listBounds.bottom) {
        scrollAmount = selectedItemBounds.bottom - listBounds.bottom;
      }
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth',
      });
    }

    return newIndex;
  });
}
