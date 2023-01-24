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
  name: string,
  todaysDateString: string,
  states: States,
) {
  const {
    habits, setHabits, streaks, setStreaks, occurrenceData, setOccurrenceData,
  } = states;

  const createdHabit = await window.electron['add-habit'](name, todaysDateString);

  const newHabits: Habit[] = [
    ...habits,
    createdHabit,
  ];

  const newStreaks: Streaks = {
    ...streaks,
    [createdHabit.id]: { current: 0, maximum: 0 },
  };

  const newOccurrenceData: OccurrenceData = {
    oldest: {
      ...occurrenceData.oldest,
      [createdHabit.id]: null,
    },
    dates: {
      ...occurrenceData.dates,
      [todaysDateString]: {
        ...occurrenceData.dates[todaysDateString],
        [createdHabit.id]: {
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
