import axios from 'axios';
import { Habit, OccurrenceData, Streaks } from '../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default async function addHabit(
  userId: number,
  name: string,
  dateString: string,
  states: States,
) {
  const {
    habits, setHabits, streaks, setStreaks, occurrenceData, setOccurrenceData,
  } = states;

  if (!habits || !occurrenceData) throw new Error('states should not be undefined');

  const { data } = await axios({
    method: 'post',
    url: '/api/habits',
    data: {
      userId,
      name,
      dateString,
    },
  });

  const createdHabit = data as Habit;

  const newHabits: Habit[] = [
    ...habits,
    createdHabit,
  ];

  const newStreaks: Streaks = {
    ...streaks,
    [createdHabit.id]: { current: 0, maximum: 0 },
  };

  const newOccurrenceData: OccurrenceData = {
    ...occurrenceData,
    dates: {
      ...occurrenceData.dates,
      [dateString]: {
        ...occurrenceData.dates[dateString],
        [createdHabit.id]: false,
      },
    },
  };

  setHabits(newHabits);
  setStreaks(newStreaks);
  setOccurrenceData(newOccurrenceData);
}
