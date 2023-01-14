import {
  DateObject, Habit, OccurrenceData, View,
} from '../../../globalTypes';
import getSelectedHabits from '../../app/getSelectedHabits';

type States = {
  selectedHabits: Habit[];
  selectedIndex: number | null;
  dateObject: DateObject;
  habits: Habit[] | undefined;
  occurrenceData: OccurrenceData | undefined;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setView: (newView: View) => void;
};

export default function transitionToView(viewName: View['name'], states: States) {
  const {
    selectedHabits,
    selectedIndex,
    dateObject,
    habits,
    occurrenceData,
    setSelectedIndex,
    setView,
  } = states;

  if (viewName === 'focus') {
    if (selectedHabits.length === 0) return;
    const selectedHabit = selectedHabits.find((habit, index) => index === selectedIndex);
    if (!selectedHabit) throw new Error('no habit found at selected index');
    setView({ name: viewName, focusId: selectedHabit.id });
    return;
  }

  if (viewName === 'history') {
    setView({ name: 'history' });
    return;
  }

  if (viewName === 'selection') {
    setSelectedIndex(0);
    setView({ name: 'selection' });
    return;
  }

  const newSelectedHabits = getSelectedHabits({
    dateObject,
    habits,
    occurrenceData,
    latchedListView: { name: viewName },
  });

  if (newSelectedHabits.length === 0) {
    setSelectedIndex(null);
  } else {
    setSelectedIndex(0);
  }

  setView({ name: viewName });
}
