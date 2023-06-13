/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DateObject, Habit, OccurrenceData, View,
} from '../../../globalTypes';
import getSelectedHabits from '../../selectedData/getSelectedHabits';

type States = {
  selectedHabits: Habit[];
  selectedIndex: number | null;
  dateObject: DateObject;
  habits: Habit[];
  occurrenceData: OccurrenceData;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function transitionToView(
  viewName: View['name'],
  {
    selectedHabits,
    selectedIndex,
    dateObject,
    habits,
    occurrenceData,
    setSelectedIndex,
    setView,
    setInInput,
  }: States,
) {
  if (viewName === 'focus') {
    setView((prevView) => {
      if (
        (prevView.name === 'selection' && selectedIndex === selectedHabits.length)
        || selectedIndex === null
      ) return prevView;

      const selectedHabit = selectedHabits[selectedIndex];
      return { name: 'focus', focusId: selectedHabit.id };
    });
  } else if (viewName === 'history') {
    setView({ name: 'history' });
  } else if (viewName === 'selection') {
    setView({ name: 'selection' });
    setSelectedIndex(0);
    if (habits.length === 0) setInInput(true);
  } else {
    const newSelectedHabits = getSelectedHabits({
      dateObject,
      habits,
      occurrenceData,
      listView: { name: viewName },
    });
    // anonymous function needed because of typescript weirdness, research later
    setView(() => ({ name: viewName }));
    setSelectedIndex(newSelectedHabits.length === 0 ? null : 0);
  }
}
