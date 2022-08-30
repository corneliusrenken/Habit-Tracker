import React, { useEffect, useState } from 'react';
import CheckListView from './checklist-view/ChecklistView';
import { Habit } from './types';

const habitSeed: Array<Habit> = [
  {
    id: 1,
    order: 1,
    name: 'go out with dogs',
    dayStreak: 1,
  },
  {
    id: 2,
    order: 2,
    name: 'read',
    dayStreak: 3,
  },
  {
    id: 3,
    order: 3,
    name: 'sleep 8 hours',
    dayStreak: 2,
  },
  {
    id: 4,
    order: 4,
    name: '6h coding challenges',
    dayStreak: 5,
  },
];

function App() {
  const [habits, setHabits] = useState<Array<Habit>>([]);

  useEffect(() => {
    setTimeout(() => {
      setHabits(habitSeed);
    }, 1000);
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
      />
    </div>
  );
}

export default App;
