import { Habit, OccurrenceData, Streaks } from '../../../../globalTypes';

type States = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[] | undefined>>;
  setStreaks: React.Dispatch<React.SetStateAction<Streaks | undefined>>;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

/**
 * @param date YYYY-MM-DD
 */
export default function addHabitStateUpdate(
  habitId: number,
  name: string,
  date: string,
  states: States,
) {
  const {
    setHabits, setStreaks, setOccurrenceData,
  } = states;

  setHabits((previousHabits) => {
    if (!previousHabits) throw new Error('state should not be undefined');

    if (previousHabits.find((habit) => habit.id === habitId) !== undefined) {
      throw new Error('habit id has to be unique');
    }

    return [
      ...previousHabits,
      { id: habitId, name },
    ];
  });

  setStreaks((previousStreaks) => {
    if (!previousStreaks) throw new Error('state should not be undefined');

    return {
      ...previousStreaks,
      [habitId]: { current: 0, maximum: 0 },
    };
  });

  setOccurrenceData((previousOccurrenceData) => {
    if (!previousOccurrenceData) throw new Error('state should not be undefined');

    return {
      oldest: {
        ...previousOccurrenceData.oldest,
        [habitId]: null,
      },
      dates: {
        ...previousOccurrenceData.dates,
        [date]: {
          ...previousOccurrenceData.dates[date],
          [habitId]: {
            complete: false,
            visible: true,
          },
        },
      },
    };
  });
}
