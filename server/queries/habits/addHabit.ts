import prisma from '../prismaClient';

export default async function addHabit(
  userId: number,
  name: string,
  dateString: string,
) {
  const habitCount = await prisma.habit.count({
    where: {
      user_id: userId,
    },
  });

  return prisma.habit.create({
    data: {
      user_id: userId,
      name,
      order: habitCount,
      occurrences: {
        create: {
          date: `${dateString}T00:00:00Z`,
          completed: false,
        },
      },
    },
    select: {
      id: true,
      name: true,
      order: true,
    },
  });
}

// below was coded taking into account adding a habit when in yesterday view
// but for now I think I only want selection view when looking at today's list

// in yesterday view you can only mark done - undone

// function getTommorrowsDateString(todaysDateString: string) {
//   const date = new Date();
//   date.setHours(0, 0, 0, 0);
//   const [year, month, day] = todaysDateString.split('-').map(Number);
//   date.setFullYear(year);
//   date.setMonth(month - 1);
//   date.setDate(day);
//   date.setDate(date.getDate() + 1);
//   const yearString = date.getFullYear();
//   const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
//   const dayString = date.getDate().toString().padStart(2, '0');
//   return `${yearString}-${monthString}-${dayString}`;
// }

// export default async function addHabit(
//   userId: number,
//   name: string,
//   dateString: string,
//   isYesterday = false,
// ) {
//   const dateStrings = [dateString];

//   if (isYesterday) {
//     dateStrings.push(getTommorrowsDateString(dateString));
//   }

//   const habitCount = await prisma.habit.count({
//     where: {
//       user_id: userId,
//     },
//   });

//   return prisma.habit.create({
//     data: {
//       user_id: userId,
//       name,
//       order: habitCount,
//       occurrences: {
//         createMany: {
//           data: dateStrings.map((dS) => ({
//             date: `${dS}T00:00:00Z`,
//             completed: false,
//           })),
//         },
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//       selected: true,
//       order: true,
//     },
//   });
// }
