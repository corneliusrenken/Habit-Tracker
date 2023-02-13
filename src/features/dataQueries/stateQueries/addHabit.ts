import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  streaks: Streaks | undefined;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function addHabit(
  name: string,
  id: number,
  todaysDateString: string,
  states: States,
) {
  const {
    habits, setHabits, streaks, setStreaks, occurrenceData, setOccurrenceData,
  } = states;

  const newHabit: Habit = {
    id,
    name,
  };

  const newHabits: Habit[] = [
    ...habits,
    newHabit,
  ];

  const newStreaks: Streaks = {
    ...streaks,
    [newHabit.id]: { current: 0, maximum: 0 },
  };

  const newOccurrenceData: OccurrenceData = {
    oldest: {
      ...occurrenceData.oldest,
      [newHabit.id]: null,
    },
    dates: {
      ...occurrenceData.dates,
      [todaysDateString]: {
        ...occurrenceData.dates[todaysDateString],
        [newHabit.id]: {
          complete: false,
          visible: true,
        },
      },
    },
  };

  setHabits(newHabits);
  setStreaks(newStreaks);
  setOccurrenceData(newOccurrenceData);
}
