import React, { useCallback, useEffect, useState } from 'react';
import {
  addCompleteToHabits, addOffsetToHabits, initializeData, toggleHabitComplete,
} from './appHelperFuncs';
import CheckListView from './checklist-view/ChecklistView';
import { getDateInfo, toCustomDateString } from './customDateFuncs';
import HistoryView from './history-view/HistoryView';
import {
  CompletedDays,
  DateInfo,
  Habit,
  HabitWithOffset,
  Occurrences,
  Streaks,
  Views,
} from './types';

const initDateInfo = getDateInfo(new Date(), 1);

function App() {
  const [view, setView] = useState<Views>('checklist');
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't') {
        setView('checklist');
        e.preventDefault();
      }
      if (e.key === 'h') {
        setView('history');
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (view === 'checklist') {
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
  // from={completedDays.oldest}
  return (
    <HistoryView
      dateInfo={dateInfo}
      from="2021-08-08"
      until={toCustomDateString(dateInfo.weekDates[6])}
      complete={completedDays.completed}
    />
  );
}

export default App;
