import {
  addHabit,
  removeHabit,
  renameHabit,
  updateHabitCompleted,
  updateHabitOrder,
  updateHabitVisibility,
} from '.';
import {
  Habit,
  DateObject,
  DayObject,
  OccurrenceData,
  Streaks,
  ApiFunctions,
} from '../../globalTypes';

type States = {
  userId: number;
  dateObject: DateObject;
  dayObject: DayObject;
  displayingYesterday: boolean;
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  selectedIndex: number;
  setSelectedIndex: (newIndex: number) => void;
};

export default function useApiFunctions(states: States): ApiFunctions | undefined {
  const {
    userId,
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    setHabits,
    occurrenceData,
    setOccurrenceData,
    streaks,
    setStreaks,
    selectedIndex,
    setSelectedIndex,
  } = states;

  if (!habits || !occurrenceData || !streaks) return undefined;

  return {
    addHabit: (name: string) => {
      addHabit(userId, name, dateObject.today.dateString, {
        habits,
        setHabits,
        occurrenceData,
        setOccurrenceData,
        streaks,
        setStreaks,
      });
    },
    removeHabit: (habitId: number) => {
      removeHabit(habitId, {
        habits,
        setHabits,
        selectedIndex,
        setSelectedIndex,
      });
    },
    renameHabit: (habitId: number, name: string) => {
      renameHabit(habitId, name, { habits, setHabits });
    },
    updateHabitCompleted: (habitId: number, completed: boolean) => {
      updateHabitCompleted(habitId, completed, dayObject.dateString, displayingYesterday, {
        streaks,
        setStreaks,
        occurrenceData,
        setOccurrenceData,
      });
    },
    updateHabitOrder: (habitId: number, newOrder: number) => {
      updateHabitOrder(habitId, newOrder, { habits, setHabits, setSelectedIndex });
    },
    updateHabitVisibility: (habitId: number, visible: boolean) => {
      updateHabitVisibility(habitId, visible, dateObject.today.dateString, {
        streaks,
        setStreaks,
        occurrenceData,
        setOccurrenceData,
      });
    },
  };
}
