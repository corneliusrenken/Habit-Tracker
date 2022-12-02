import { PrismaClient } from '@prisma/client';
import { getDateFromDateString } from '../../src/features/common/dateStringFunctions';
import getCustomDateString from '../../src/features/common/getCustomDateString';
import { addHabit } from '../queries/habits';
import { addOccurrences } from '../queries/occurrences';

const prisma = new PrismaClient();

const seedStartDateString = '2022-11-01';
const todayDateString = '2022-12-01';

async function main() {
  await prisma.user.create({ data: { id: 1 } });

  const habits = [
    await addHabit(1, 'play guitar', todayDateString),
    await addHabit(1, 'code', todayDateString),
    await addHabit(1, 'exercise', todayDateString),
    await addHabit(1, 'read', todayDateString),
  ];

  const currentDate = getDateFromDateString(seedStartDateString);
  const dateToday = getDateFromDateString(todayDateString);

  const occurrencesToAdd = [];

  while (currentDate.getTime() <= dateToday.getTime()) {
    const currentDayString = getCustomDateString(currentDate);
    let habitsToAdd = Math.floor(Math.random() * 5);
    const habitsToPick = habits.slice();

    while (habitsToAdd > 0) {
      const randomIndex = Math.floor(Math.random() * habitsToPick.length);
      const [habitToAdd] = habitsToPick.splice(randomIndex, 1);
      occurrencesToAdd.push({
        habitId: habitToAdd.id,
        dateString: currentDayString,
        completed: Boolean(Math.floor(Math.random() * 2)),
      });
      habitsToAdd -= 1;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  await addOccurrences(occurrencesToAdd);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e); // eslint-disable-line no-console
    await prisma.$disconnect();
    process.exit(1);
  });
