import prisma from '..';

export function getCompletedDays(userId: number) {
  return prisma.completedDay.findMany({
    where: {
      user_id: userId,
    },
    select: {
      date: true,
    },
    orderBy: {
      date: 'asc',
    },
  });
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
