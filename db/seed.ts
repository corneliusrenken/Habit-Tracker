/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { toCustomDateString } from '../src/customDateFuncs';
import { addCompletedDay } from './models/completedDays';
import { addHabit } from './models/habits';
import { addOccurrence } from './models/occurrences';
import { addUser } from './models/users';

const prisma = new PrismaClient();

async function main() {
  const user = await addUser();

  const habitNames = [
    'go out with dogs', // 0 streak current, 1 max
    'read', //  1 streak current, 2 max
    '6h coding challenges', // 4 streak current, 4 max
    'sleep 8 hours', // 0 streak current, 0 max
  ];

  const habits = [
    await addHabit(user.id, habitNames[0], 0),
    await addHabit(user.id, habitNames[1], 1),
    await addHabit(user.id, habitNames[2], 2),
    await addHabit(user.id, habitNames[3], 3),
  ];

  /*
  const seed = '2373103710371037373103710371730173';
  const today = new Date('2022-09-02T12:00:00Z');

  const promises = [];

  for (let i = 0; i < seed.length; i += 1) {
    const digit = (Number(seed[i]) % 4) + 1;
    const temp = new Date(today);
    temp.setDate(today.getDate() - i);
    const dateString = `${temp.getFullYear()}-${(temp.getMonth() + 1).
      toString().padStart(2, '0')}-${temp.getDate().toString().padStart(2, '0')}`;
    for (let j = 0; j < digit; j += 1) {
      promises.push(addOccurrence(habits[j].id, `${dateString}T00:00:00Z`));
    }
    if (digit === 4) {
      promises.push(addCompletedDay(user.id, `${dateString}T00:00:00Z`));
    }
  }

  Promise.all(promises);
  */
  const today = new Date();
  today.setDate(today.getDate());
  const before1 = new Date();
  before1.setDate(today.getDate() - 1);
  const before2 = new Date();
  before2.setDate(today.getDate() - 2);
  const before3 = new Date();
  before3.setDate(today.getDate() - 3);

  // await addOccurrence(1, `${toCustomDateString(before3)}T00:00:00Z`);
  // await addOccurrence(2, `${toCustomDateString(before3)}T00:00:00Z`);
  // await addOccurrence(3, `${toCustomDateString(before3)}T00:00:00Z`);

  // await addOccurrence(2, `${toCustomDateString(before2)}T00:00:00Z`);
  // await addOccurrence(3, `${toCustomDateString(before2)}T00:00:00Z`);

  // await addOccurrence(3, `${toCustomDateString(before1)}T00:00:00Z`);

  // await addOccurrence(2, `${toCustomDateString(today)}T00:00:00Z`);
  // await addOccurrence(3, `${toCustomDateString(today)}T00:00:00Z`);

  await addOccurrence(1, `${toCustomDateString(before2)}T00:00:00Z`);
  await addOccurrence(2, `${toCustomDateString(before1)}T00:00:00Z`);
  await addOccurrence(3, `${toCustomDateString(today)}T00:00:00Z`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
