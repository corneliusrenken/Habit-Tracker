import prisma from '../prismaClient';
import { getAllHabits } from '../habits';
import { getOccurrencesByDate, getOccurrenceStreaks, getOldestTrueOccurrences } from '../occurrences';

export default async function initializeApp(userId: number, dateString: string) {
  const occurrences = await getOccurrencesByDate(userId);
  const streaks = await getOccurrenceStreaks(userId, dateString);
  const oldestOccurrences = await getOldestTrueOccurrences(userId);
  const habits = await getAllHabits(userId);

  if (occurrences[dateString] === undefined) {
    occurrences[dateString] = {};

    const lastDateQueryResult: { max_date: string }[] = await prisma.$queryRaw`
      SELECT
        to_char(max(date), 'YYYY-MM-DD') as max_date
      FROM
        occurrences
      JOIN
        habits
      ON
        occurrences.habit_id = habits.id
      WHERE
        habits.user_id = ${userId}
    `;

    const lastDate = lastDateQueryResult[0].max_date;

    /**
     * if occurrences have been logged before, take the last most entry and copy over
     * the habits that were selected at that time, creating false occurrences so that they
     * show up in the list, but are not marked done
     */
    if (lastDate !== null) {
      const habitIdsFromLastDate = Object.keys(occurrences[lastDate]).map(Number);
      habitIdsFromLastDate.forEach((habitId) => { occurrences[dateString][habitId] = false; });
      await prisma.occurrence.createMany({
        data: habitIdsFromLastDate.map((habitId) => ({
          habit_id: habitId,
          date: `${dateString}T00:00:00Z`,
          completed: false,
        })),
      });
    }
  }

  return {
    habits,
    occurrences,
    streaks,
    oldestOccurrences,
  };
}
