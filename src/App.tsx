import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import CheckListView from './checklist-view/ChecklistView';
import { toCustomDateString } from './customDateFuncs';
import {
  CompletedDays,
  Habit, HabitWithComplete, HabitWithOffset, Occurrences,
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

function App() {
  // eslint-disable-next-line max-len
  const [completedDays, setCompletedDays] = useState<CompletedDays>({ completed: {}, oldest: null });
  const [occurrences, setOccurrences] = useState<Occurrences>({});
  const [habits, setHabits] = useState<Array<Habit>>([]);
  const [habitsWithOffset, setHabitsWithOffset] = useState<Array<HabitWithOffset>>([]);
  const [today] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const userId = 1;
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const todayString = toCustomDateString(today);
      const yesterdayString = toCustomDateString(yesterday);
      const responses = await Promise.all([
        axios.get(`/api/habits/${userId}`),
        axios.get(`/api/occurrences/${userId}/${yesterdayString}/${todayString}`),
        axios.get(`/api/completed-days/${userId}`),
      ]);
      const habitsData = responses[0].data;
      const occurrencesData = responses[1].data;
      const completedDaysData = responses[2].data;
      setHabits(habitsData);
      setOccurrences(occurrencesData);
      setCompletedDays(completedDaysData);
    };

    fetchData();
  }, [today]);

  const calculateHabitsWithOffset = useCallback(() => {
    const todayString = toCustomDateString(today);
    const complete = addCompleteToHabits(habits, occurrences[todayString]);
    const offset = addOffsetToHabits(complete);
    setHabitsWithOffset(offset);
  }, [habits, occurrences, today]);

  useEffect(() => {
    calculateHabitsWithOffset();
  }, [calculateHabitsWithOffset]);

  const toggleHabitComplete = (id: number) => {
    const todayString = toCustomDateString(today);
    const newOccurrences = occurrences[todayString] !== undefined
      ? occurrences[todayString].slice()
      : [];
    const indexOfOccurrence = newOccurrences.indexOf(id);
    let occurrenceHttpMethod;
    let completeHttpMethod;
    const incompleteCount = habitsWithOffset.filter((habit) => (
      !habit.complete && habit.selected
    )).length;
    if (indexOfOccurrence === -1) {
      newOccurrences.push(id);
      occurrenceHttpMethod = 'post';
      if (incompleteCount === 1) {
        completeHttpMethod = 'post';

        const newCompletedDays: CompletedDays = {
          oldest: completedDays.oldest || `${todayString}T00:00:00.000Z`,
          completed: { ...completedDays.completed, [todayString]: true },
        };

        setCompletedDays(newCompletedDays);
      }
    } else {
      newOccurrences.splice(indexOfOccurrence, 1);
      occurrenceHttpMethod = 'delete';
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
    setOccurrences({
      ...occurrences,
      [todayString]: newOccurrences,
    });
  };

  return (
    <div>
      <CheckListView
        habits={habitsWithOffset}
        toggleHabitComplete={toggleHabitComplete}
        today={today}
        completedDays={completedDays}
      />
    </div>
  );
}

export default App;
