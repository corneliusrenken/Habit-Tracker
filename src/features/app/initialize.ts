import axios from 'axios';
import {
  Habit, OccurrenceData, OccurrencesByDate, OldestOccurrences, Streaks,
} from '../../globalTypes';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
};

type InitializeRequestData = {
  habits: Habit[];
  occurrences: OccurrencesByDate;
  oldestOccurrences: OldestOccurrences;
  streaks: Streaks;
};

export default async function initialize(userId: number, dateString: string, states: States) {
  const { setHabits, setOccurrenceData, setStreaks } = states;

  try {
    const { data }: { data: InitializeRequestData } = await axios({
      method: 'get',
      url: `/api/users/${userId}/initialize/${dateString}`,
    });

    setHabits(data.habits);
    setOccurrenceData({
      dates: data.occurrences,
      oldest: data.oldestOccurrences,
    });
    setStreaks(data.streaks);
  } catch (error) {
    throw new Error('Failed to initialize application');
  }
}
