import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CheckListView from './checklist-view/ChecklistView';
import { toCustomDateString } from './customDateFuncs';
import { Habit, HabitWithComplete, HabitWithOffset } from './types';

// eslint-disable-next-line max-len
const addCompleteToHabits = (habits: Array<Habit>, occurrences: Array<number> | undefined): Array<HabitWithComplete> => (
  habits.map((habit) => {
    const complete = occurrences?.findIndex((id) => id === habit.id) !== -1;
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
  const [habits, setHabits] = useState<Array<HabitWithOffset>>([]);
  const [today] = useState<Date>(new Date());

  const toggleHabitComplete = (id: number) => {
    const newHabits = habits.slice();
    const indexOfId = newHabits.findIndex((habit) => habit.id === id);
    if (newHabits[indexOfId].complete) {
      axios({
        method: 'delete',
        url: '/api/occurrences/',
        data: {
          habitId: id,
          date: toCustomDateString(today),
        },
      });
    } else {
      axios({
        method: 'post',
        url: '/api/occurrences/',
        data: {
          habitId: id,
          date: toCustomDateString(today),
        },
      });
    }
    newHabits[indexOfId].complete = !newHabits[indexOfId].complete;
    const newOffset = addOffsetToHabits(newHabits);
    setHabits(newOffset);
  };

  useEffect(() => {
    const fetchData = async () => {
      const todayString = toCustomDateString(today);
      const responses = await Promise.all([
        axios.get('/api/habits/1'),
        axios.get(`/api/occurrences/1/${todayString}/${todayString}`),
      ]);
      const habitsData = responses[0].data;
      const occurrencesData = responses[1].data;
      const habitsWithComplete = addCompleteToHabits(habitsData, occurrencesData[todayString]);
      const habitsWithOffset = addOffsetToHabits(habitsWithComplete);
      setHabits(habitsWithOffset);
    };

    fetchData();
  }, [today]);

  // scroll to bottom of page whenever habits change in length
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  }, [habits.length]);

  return (
    <div>
      {/* placeholder for history view */}
      <div style={{ height: '1000px' }} />
      <CheckListView
        habits={habits}
        toggleHabitComplete={toggleHabitComplete}
        today={today}
      />
    </div>
  );
}

export default App;
