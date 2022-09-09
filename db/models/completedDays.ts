import prisma from '..';

type CompletedDays = Promise<Array<{ completed: { [key: string]: boolean }, oldest: string }>>;

export function getCompletedDays(userId: number): CompletedDays {
  return prisma.$queryRaw`
    SELECT
      COALESCE(
        JSON_OBJECT_AGG(date, true)
      FILTER (WHERE date IS NOT NULL), '{}') AS completed,
      to_char(min(date), 'YYYY-MM-DD') AS oldest
    FROM
      completed_days
    WHERE
      user_id = ${userId}
  `;
}

export function addCompletedDay(userId: number, date: string) {
  return prisma.completedDay.create({
    data: {
      date,
      user_id: userId,
    },
  });
}

export function deleteCompletedDay(userId: number, date: string) {
  return prisma.completedDay.delete({
    where: {
      date_user_id: { date, user_id: userId },
    },
  });
}
