import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import CheckListView from './checklist-view/ChecklistView';
import { getDateInfo, isDateStringEarlier } from './customDateFuncs';
import {
  CompletedDays,
  DateInfo,
  Habit,
  HabitWithComplete,
  HabitWithOffset,
  Occurrences,
  Streaks,
} from './types';

// eslint-disable-next-line max-len
const addCompleteToHabits = (habits: Array<Habit>, occurrences: Array<number> | undefined): Array<HabitWithComplete> => (
  habits.map((habit) => {
    if (occurrences === undefined) {
      return { ...habit, complete: false };
    }
    const complete = occurrences.findIndex((id) => id === habit.id) !== -1;
    return { ...habit, complete };
  })
);

// eslint-disable-next-line max-len
const addOffsetToHabits = (habits: Array<HabitWithComplete | HabitWithOffset>): Array<HabitWithOffset> => (
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

const initDateInfo = getDateInfo(new Date(), 1);

function App() {
  const [dateInfo] = useState<DateInfo>(initDateInfo);
  // eslint-disable-next-line max-len
  const [completedDays, setCompletedDays] = useState<CompletedDays>({ completed: {}, oldest: null });
  const [occurrences, setOccurrences] = useState<Occurrences>({ occurrences: {}, oldest: null });
  const [streaks, setStreaks] = useState<Streaks>({});
  const [habits, setHabits] = useState<Array<Habit>>([]);
  const [habitsWithOffset, setHabitsWithOffset] = useState<Array<HabitWithOffset>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = 1;
      const { todayString, yesterdayString } = dateInfo;
      const responses = await Promise.all([
        axios.get(`/api/habits/${userId}`),
        axios({
          method: 'get',
          url: `/api/occurrences/${userId}`,
          params: {
            from: yesterdayString,
            until: todayString,
          },
        }),
        axios.get(`/api/completed-days/${userId}`),
        axios({
          method: 'get',
          url: `/api/occurrences/streaks/${userId}`,
          params: {
            today: todayString,
          },
        }),
      ]);
      setHabits(responses[0].data);
      setOccurrences(responses[1].data);
      setCompletedDays(responses[2].data);
      setStreaks(responses[3].data);
    };

    fetchData();
  }, [dateInfo]);

  const calculateHabitsWithOffset = useCallback(() => {
    const { todayString } = dateInfo;
    const complete = addCompleteToHabits(habits, occurrences.occurrences[todayString]);
    const offset = addOffsetToHabits(complete);
    setHabitsWithOffset(offset);
  }, [habits, occurrences, dateInfo]);

  useEffect(() => {
    calculateHabitsWithOffset();
  }, [calculateHabitsWithOffset]);

  const toggleHabitComplete = (id: number) => {
    const { todayString } = dateInfo;
    const newOccurrencesForToday = occurrences.occurrences[todayString] !== undefined
      ? occurrences.occurrences[todayString].slice()
      : [];
    const indexOfOccurrence = newOccurrencesForToday.indexOf(id);
    let occurrenceHttpMethod;
    let completeHttpMethod;
    const incompleteCount = habitsWithOffset.filter((habit) => (
      !habit.complete && habit.selected
    )).length;
    if (indexOfOccurrence === -1) {
      newOccurrencesForToday.push(id);
      occurrenceHttpMethod = 'post';

      setStreaks({
        ...streaks,
        [id]: {
          current: streaks[id].current + 1,
          maximum: streaks[id].maximum, // updates later through api call
        },
      });

      if (incompleteCount === 1) {
        completeHttpMethod = 'post';

        const newCompletedDays: CompletedDays = {
          oldest: completedDays.oldest || `${todayString}T00:00:00.000Z`,
          completed: { ...completedDays.completed, [todayString]: true },
        };
        setCompletedDays(newCompletedDays);
      }
    } else {
      newOccurrencesForToday.splice(indexOfOccurrence, 1);
      occurrenceHttpMethod = 'delete';

      setStreaks({
        ...streaks,
        [id]: {
          current: streaks[id].current - 1,
          maximum: streaks[id].maximum, // updates later through api call
        },
      });

      if (incompleteCount === 0) {
        completeHttpMethod = 'delete';

        const newCompletedDays: CompletedDays = {
          oldest: completedDays.oldest?.startsWith(todayString) ? null : completedDays.oldest,
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
        habitId: id,
        date: todayString,
      },
    })
      .then(() => (
        axios({
          method: 'get',
          url: '/api/occurrences/streaks/1',
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
          userId: 1,
          date: todayString,
        },
      });
    }

    let newOldestOccurrence;
    if (occurrenceHttpMethod === 'post') {
      if (occurrences.oldest === null) {
        newOldestOccurrence = todayString;
      } else {
        newOldestOccurrence = isDateStringEarlier(todayString, occurrences.oldest)
          ? todayString
          : occurrences.oldest;
      }
    } else if (occurrences.oldest === todayString && newOccurrencesForToday.length === 0) {
      newOldestOccurrence = null;
    } else {
      newOldestOccurrence = occurrences.oldest;
    }

    setOccurrences({
      occurrences: {
        ...occurrences.occurrences,
        [todayString]: newOccurrencesForToday,
      },
      oldest: newOldestOccurrence,
    });
  };

  return (
    <div>
      <CheckListView
        habits={habitsWithOffset}
        toggleHabitComplete={toggleHabitComplete}
        dateInfo={dateInfo}
        completedDays={completedDays}
        streaks={streaks}
      />
    </div>
  );
}

export default App;
