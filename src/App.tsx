import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import CheckListView from './checklist-view/ChecklistView';
import { toCustomDateString } from './customDateFuncs';
import {
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
  const [occurrences, setOccurrences] = useState<Occurrences>({});
  const [habits, setHabits] = useState<Array<Habit>>([]);
  const [habitsWithOffset, setHabitsWithOffset] = useState<Array<HabitWithOffset>>([]);
  const [today] = useState<Date>(new Date());

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
    let httpMethod;
    if (indexOfOccurrence === -1) {
      newOccurrences.push(id);
      httpMethod = 'post';
    } else {
      newOccurrences.splice(indexOfOccurrence, 1);
      httpMethod = 'delete';
    }
    axios({
      url: '/api/occurrences',
      method: httpMethod,
      data: {
        habitId: id,
        date: todayString,
      },
    });
    setOccurrences({
      ...occurrences,
      [todayString]: newOccurrences,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const todayString = toCustomDateString(today);
      const yesterdayString = toCustomDateString(yesterday);
      const responses = await Promise.all([
        axios.get('/api/habits/1'),
        axios.get(`/api/occurrences/1/${yesterdayString}/${todayString}`),
      ]);
      const habitsData = responses[0].data;
      const occurrencesData = responses[1].data;
      setHabits(habitsData);
      setOccurrences(occurrencesData);
    };

    fetchData();
  }, [today]);

  return (
    <div>
      <CheckListView
        habits={habitsWithOffset}
        toggleHabitComplete={toggleHabitComplete}
        today={today}
      />
    </div>
  );
}

export default App;
