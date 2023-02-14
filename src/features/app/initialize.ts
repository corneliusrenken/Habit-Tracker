import {
  Habit, OccurrenceData, Streaks, View,
} from '../../globalTypes';

type States = {
  setView: (newView: View) => void;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
};

export default async function initialize(todayDateString: string, states: States) {
  const {
    setView, setSelectedIndex, setHabits, setOccurrenceData, setStreaks,
  } = states;

  try {
    const {
      habits,
      occurrencesGroupedByDate,
      oldestVisibleOccurrenceDates,
      streaks,
    } = await window.electron['initialize-app'](todayDateString);

    const todaysOccurrences = occurrencesGroupedByDate[todayDateString];
    const visibleHabitCount = Object.keys(todaysOccurrences).length;

    setView({ name: 'today' });
    setSelectedIndex(visibleHabitCount === 0 ? null : 0);

    setHabits(habits);
    setOccurrenceData({
      dates: occurrencesGroupedByDate,
      oldest: oldestVisibleOccurrenceDates,
    });
    setStreaks(streaks);
  } catch (error) {
    throw new Error('Failed to initialize application');
  }
}
