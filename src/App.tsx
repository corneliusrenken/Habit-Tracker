import React, { useCallback, useEffect, useState } from 'react';
import {
  addCompleteToHabits, addOffsetToHabits, initializeData, toggleHabitComplete,
} from './appHelperFuncs';
import CheckListView from './checklist-view/ChecklistView';
import { getDateInfo } from './customDateFuncs';
import {
  CompletedDays,
  DateInfo,
  Habit,
  HabitWithOffset,
  Occurrences,
  Streaks,
} from './types';

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
    initializeData({
      userId: 1,
      dateInfo,
      setHabits,
      setOccurrences,
      setCompletedDays,
      setStreaks,
    });
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

  const toggleHabitCompleteMemo = useCallback((habitId: number) => (
    toggleHabitComplete(habitId, {
      userId: 1,
      dateInfo,
      habitsWithOffset,
      occurrences,
      setOccurrences,
      streaks,
      setStreaks,
      completedDays,
      setCompletedDays,
    })
  ), [completedDays, dateInfo, habitsWithOffset, occurrences, streaks]);

  return (
    <div>
      <CheckListView
        habits={habitsWithOffset}
        toggleHabitComplete={toggleHabitCompleteMemo}
        dateInfo={dateInfo}
        completedDays={completedDays}
        streaks={streaks}
      />
    </div>
  );
}

export default App;
