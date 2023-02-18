import { Habit, OccurrenceData, Streaks } from '../../../globalTypes';

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

    const newHabits : Habit[] = JSON.parse(JSON.stringify(previousHabits));

    newHabits.push({ id: habitId, name });

    return [
      ...previousHabits,
      { id: habitId, name },
    ];
  });

  setStreaks((previousStreaks) => {
    if (!previousStreaks) throw new Error('state should not be undefined');

    const newStreaks: Streaks = JSON.parse(JSON.stringify(previousStreaks));

    newStreaks[habitId] = { current: 0, maximum: 0 };

    return newStreaks;
  });

  setOccurrenceData((previousOccurrenceData) => {
    if (!previousOccurrenceData) throw new Error('state should not be undefined');

    const newOccurrenceData: OccurrenceData = JSON.parse(JSON.stringify(previousOccurrenceData));

    newOccurrenceData.oldest[habitId] = date;

    newOccurrenceData.dates[date][habitId] = { complete: false, visible: true };

    return newOccurrenceData;
  });
}
