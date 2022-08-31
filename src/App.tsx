import React, { useEffect, useState } from 'react';
import CheckListView from './checklist-view/ChecklistView';
import { Habit, HabitWithOffset } from './types';

const habitSeed: Array<Habit> = [
  {
    id: 1,
    order: 0,
    name: 'go out with dogs',
    dayStreak: 1,
    complete: false,
  },
  {
    id: 2,
    order: 1,
    name: 'read',
    dayStreak: 3,
    complete: false,
  },
  {
    id: 3,
    order: 2,
    name: 'sleep 8 hours',
    dayStreak: 2,
    complete: true,
  },
  {
    id: 4,
    order: 3,
    name: '6h coding challenges',
    dayStreak: 5,
    complete: false,
  },
];

const addHabitsOffset = (habits: Array<Habit | HabitWithOffset>): Array<HabitWithOffset> => (
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

  const setHabitsAndAddOffset = (newHabits: Array<Habit | HabitWithOffset>) => {
    setHabits(addHabitsOffset(newHabits));
  };

  const markHabitComplete = (id: number) => {
    const newHabits = habits.slice();
    const index = newHabits.findIndex((habit) => habit.id === id);
    newHabits[index].complete = !newHabits[index].complete;
    setHabitsAndAddOffset(newHabits);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHabitsAndAddOffset(habitSeed);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

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
        markHabitComplete={markHabitComplete}
      />
    </div>
  );
}

export default App;
