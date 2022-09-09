import axios from 'axios';
import { isDateStringEarlier } from './customDateFuncs';
import {
  CompletedDays,
  DateInfo,
  Habit,
  HabitWithComplete,
  HabitWithOffset,
  Occurrences,
  Streaks,
} from './types';

type InitializeDataStates = {
  userId: number;
  dateInfo: DateInfo;
  setHabits: Function;
  setOccurrences: Function;
  setCompletedDays: Function;
  setStreaks: Function;
};

export const initializeData = async (states: InitializeDataStates) => {
  const {
    userId,
    dateInfo,
    setHabits,
    setOccurrences,
    setCompletedDays,
    setStreaks,
  } = states;

  const { todayString, yesterdayString } = dateInfo;
  const responses = await Promise.all([
    axios.get(`/api/habits/${userId}`),
    axios.get(`/api/occurrences/${userId}`, { params: { from: yesterdayString, until: todayString } }),
    axios.get(`/api/completed-days/${userId}`),
    axios.get(`/api/occurrences/streaks/${userId}`, { params: { today: todayString } }),
  ]);
  setHabits(responses[0].data);
  setOccurrences(responses[1].data);
  setCompletedDays(responses[2].data);
  setStreaks(responses[3].data);
};

// eslint-disable-next-line max-len
export const addCompleteToHabits = (habits: Array<Habit>, occurrences: Array<number> | undefined): Array<HabitWithComplete> => (
  habits.map((habit) => {
    if (occurrences === undefined) {
      return { ...habit, complete: false };
    }
    const complete = occurrences.findIndex((id) => id === habit.id) !== -1;
    return { ...habit, complete };
  })
);

// eslint-disable-next-line max-len
export const addOffsetToHabits = (habits: Array<HabitWithComplete | HabitWithOffset>): Array<HabitWithOffset> => (
  habits.sort((a, b) => {
    if (a.complete !== b.complete) {
      return a.complete ? 1 : -1;
    }
    return a.order - b.order;
  }).map((habit, index) => {
    const newHabit = { ...habit, offset: index };
    return newHabit;
  }).sort((a, b) => a.id - b.id)
);

type ToggleHabitCompleteStates = {
  userId: number;
  dateInfo: DateInfo;
  habitsWithOffset: Array<HabitWithOffset>;
  occurrences: Occurrences;
  setOccurrences: Function;
  streaks: Streaks;
  setStreaks: Function;
  completedDays: CompletedDays;
  setCompletedDays: Function;
};

export const toggleHabitComplete = (habitId: number, states: ToggleHabitCompleteStates) => {
  const {
    userId,
    dateInfo,
    habitsWithOffset,
    occurrences,
    setOccurrences,
    streaks,
    setStreaks,
    completedDays,
    setCompletedDays,
  } = states;

  const { todayString } = dateInfo;

  const occurrencesToday = occurrences.occurrences[todayString] !== undefined
    ? occurrences.occurrences[todayString].slice()
    : [];

  const incompleteHabitCount = habitsWithOffset.filter((habit) => (
    !habit.complete && habit.selected
  )).length;

  const indexOfHabitInTodaysOccurrences = occurrencesToday.indexOf(habitId);

  let occurrenceHttpMethod;
  let completeHttpMethod;

  if (indexOfHabitInTodaysOccurrences === -1) {
    occurrencesToday.push(habitId);
    occurrenceHttpMethod = 'post';

    setStreaks({
      ...streaks,
      [habitId]: {
        current: streaks[habitId].current + 1,
        maximum: streaks[habitId].maximum, // updates later through api call
      },
    });

    if (incompleteHabitCount === 1) {
      completeHttpMethod = 'post';

      const newCompletedDays: CompletedDays = {
        oldest: completedDays.oldest || `${todayString}T00:00:00.000Z`,
        completed: { ...completedDays.completed, [todayString]: true },
      };
      setCompletedDays(newCompletedDays);
    }
  } else {
    occurrencesToday.splice(indexOfHabitInTodaysOccurrences, 1);
    occurrenceHttpMethod = 'delete';

    setStreaks({
      ...streaks,
      [habitId]: {
        current: streaks[habitId].current - 1,
        maximum: streaks[habitId].maximum, // updates later through api call
      },
    });

    if (incompleteHabitCount === 0) {
      completeHttpMethod = 'delete';

      const newCompletedDays: CompletedDays = {
        oldest: completedDays.oldest === todayString ? null : completedDays.oldest,
        completed: { ...completedDays.completed },
      };
      delete newCompletedDays.completed[todayString];
      setCompletedDays(newCompletedDays);
    }
  }
  axios({
    url: '/api/occurrences',
    method: occurrenceHttpMethod,
    data: {
      habitId,
      date: todayString,
    },
  })
    .then(() => (
      axios({
        method: 'get',
        url: `/api/occurrences/streaks/${userId}`,
        params: {
          today: todayString,
        },
      })
    ))
    .then(({ data }) => {
      setStreaks(data);
    });
  if (completeHttpMethod) {
    axios({
      url: '/api/completed-days',
      method: completeHttpMethod,
      data: {
        userId,
        date: todayString,
      },
    });
  }

  // does this work with yesterday feature?
  let newOldestOccurrence;
  if (occurrenceHttpMethod === 'post') {
    if (occurrences.oldest === null) {
      newOldestOccurrence = todayString;
    } else {
      newOldestOccurrence = isDateStringEarlier(todayString, occurrences.oldest)
        ? todayString
        : occurrences.oldest;
    }
  } else if (occurrences.oldest === todayString && occurrencesToday.length === 0) {
    newOldestOccurrence = null;
  } else {
    newOldestOccurrence = occurrences.oldest;
  }

  setOccurrences({
    occurrences: {
      ...occurrences.occurrences,
      [todayString]: occurrencesToday,
    },
    oldest: newOldestOccurrence,
  });
};
