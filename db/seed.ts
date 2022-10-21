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
    'network', // 0 streak current, 0 max
    'no phone after bed', // 0 streak current, 0 max
  ];

  const habits = [
    await addHabit(user.id, habitNames[0], 0),
    await addHabit(user.id, habitNames[1], 1),
    await addHabit(user.id, habitNames[2], 2),
    await addHabit(user.id, habitNames[3], 3),
    await addHabit(user.id, habitNames[4], 4),
    await addHabit(user.id, habitNames[5], 5),
  ];

  const seed = '237310371037103737310371037173017323731037103710373731037103717301732373103710371037373103710371730173';
  const today = new Date('2022-09-10T12:00:00Z');

  const promises = [];

  for (let i = 0; i < seed.length; i += 1) {
    const digit = (Number(seed[i]) % 4) + 1;
    const temp = new Date(today);
    temp.setDate(today.getDate() - i);
    const dateString = toCustomDateString(temp);
    for (let j = 0; j < digit; j += 1) {
      promises.push(addOccurrence(habits[j].id, `${dateString}T00:00:00Z`));
    }
    if (digit === 4) {
      promises.push(addCompletedDay(user.id, `${dateString}T00:00:00Z`));
    }
  }

  Promise.all(promises);
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
