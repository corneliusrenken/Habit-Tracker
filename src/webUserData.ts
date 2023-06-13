import { getDateStringFromDate } from './features/common/dateStringFunctions';
import getDateObject from './features/common/getDateObject';
import recalculateStreak from './features/common/recalculateStreak';
import { Config, Habit, OccurrenceData, Streaks } from './globalTypes';

// seed used to select how many habits are 'done' on a given day
const seed = '4240044002434202134240443444441344420403042044222122440013443442344214134434231444321444430241042400';

const today = new Date();
const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const day = days[dayOfWeek];

const config: Config = {
  theme: 'System',
  startWeekOn: 'Mon',
};

const dateObject = getDateObject(day, today);

const habitNames = [
  'Sleep 8 hours',
  'Exercise',
  'Read',
  'No caffeine',
];

const habits: Habit[] = habitNames.map((name, index) => ({ id: index + 1, name }));

const occurrenceData: OccurrenceData = {
  oldest: {},
  dates: {},
}

habits.forEach(({ id }) => { occurrenceData.oldest[id] = null });

for (let i = 0; i < seed.length; i += 1) {
  const seedValue = Number(seed[i]);
  if (seedValue === 0) continue;

  const date = new Date(today);
  date.setDate(date.getDate() - i);
  const dateString = getDateStringFromDate(date);
  occurrenceData.dates[dateString] = {};

  habits.forEach(({ id }) => {
    if (id <= seedValue) {
      occurrenceData.dates[dateString][id] = { complete: true, visible: true };
      occurrenceData.oldest[id] = dateString;
    } else {
      occurrenceData.dates[dateString][id] = { complete: false, visible: true };
    }
  });
}

const streaks: Streaks = {};

habits.forEach(({ id }) => {
  streaks[id] = recalculateStreak(id, dateObject.today.dateString, occurrenceData);
});

export {
  config,
  dateObject,
  habits,
  occurrenceData,
  streaks,
}
