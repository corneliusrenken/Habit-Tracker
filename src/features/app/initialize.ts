import axios from 'axios';
import {
  Habit, OccurrenceData, OccurrencesByDate, OldestOccurrences, Streaks, View,
} from '../../globalTypes';

type States = {
  setView: (v: View) => void;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
};

type InitializeRequestData = {
  habits: Habit[];
  occurrencesByDate: OccurrencesByDate;
  oldestOccurrences: OldestOccurrences;
  streaks: Streaks;
};

export default async function initialize(userId: number, todayDateString: string, states: States) {
  const {
    setView, setHabits, setOccurrenceData, setStreaks,
  } = states;

  try {
    const { data }: { data: InitializeRequestData } = await axios({
      method: 'get',
      url: `/api/users/${userId}/initialize/${todayDateString}`,
    });

    const todaysOccurrences = data.occurrencesByDate[todayDateString];
    const visibleHabitCount = Object.keys(todaysOccurrences).length;

    if (visibleHabitCount === 0) {
      setView('selection');
    } else {
      setView('habit');
    }

    setHabits(data.habits);
    setOccurrenceData({
      dates: data.occurrencesByDate,
      oldest: data.oldestOccurrences,
    });
    setStreaks(data.streaks);
  } catch (error) {
    throw new Error('Failed to initialize application');
  }
}
