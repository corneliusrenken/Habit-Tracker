import { useEffect } from 'react';
import {
  ApiFunctions, DateObject, DayObject, Habit, OccurrenceData, View,
} from '../../globalTypes';
import shortcutManager from './shortcutManager';

type States = {
  apiFunctions: ApiFunctions | undefined;
  dateObject: DateObject;
  dayObject: DayObject;
  displayingYesterday: boolean;
  habits: Habit[] | undefined;
  inInput: boolean;
  inTransition: boolean;
  occurrenceData: OccurrenceData | undefined;
  selectedHabits: Habit[];
  selectedIndex: number | null;
  view: View;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
  setDisplayingYesterday: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setFocusId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default function useShortcutManager(states: States) {
  const {
    apiFunctions,
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setDisplayingYesterday,
    setSelectedIndex,
    setFocusId,
  } = states;

  useEffect(() => {
    if (!habits || !occurrenceData || !apiFunctions) return;

    const onKeyDown = (e: KeyboardEvent) => shortcutManager(e, {
      apiFunctions,
      dateObject,
      dayObject,
      displayingYesterday,
      habits,
      inInput,
      inTransition,
      occurrenceData,
      selectedHabits,
      selectedIndex,
      view,
      setInInput,
      setView,
      setDisplayingYesterday,
      setSelectedIndex,
      setFocusId,
    });

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown); // eslint-disable-line consistent-return, max-len
  }, [
    apiFunctions,
    dateObject,
    dayObject,
    displayingYesterday,
    habits,
    inInput,
    inTransition,
    occurrenceData,
    selectedHabits,
    selectedIndex,
    view,
    setInInput,
    setView,
    setDisplayingYesterday,
    setSelectedIndex,
    setFocusId,
  ]);
}
