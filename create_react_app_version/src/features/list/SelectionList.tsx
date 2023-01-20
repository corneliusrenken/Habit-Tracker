import React from 'react';
import { Habit } from '../../globalTypes';
import AddHabitForm from './AddHabitForm';
import ReorderableList from './ReorderableList';
import useMemoizedSelectionListItemConstructors from './useMemoizedSelectionListItemConstructors';

type Props = {
  allowTabTraversal: boolean;
  habits: Habit[];
  todaysOccurrences: {
    [habitId: string]: boolean;
  };
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  addHabit: (name: string) => Promise<void>;
  removeHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitOrder: (habitId: number, newOrder: number) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function SelectionList({
  allowTabTraversal,
  habits,
  todaysOccurrences,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
  reorderingList,
  setReorderingList,
  addHabit,
  removeHabit,
  renameHabit,
  updateHabitOrder,
  updateHabitVisibility,
}: Props) {
  const elementConstructors = useMemoizedSelectionListItemConstructors({
    allowTabTraversal,
    habits,
    todaysOccurrences,
    selectedIndex,
    setSelectedIndex,
    inInput,
    setInInput,
    reorderingList,
    setReorderingList,
    removeHabit,
    renameHabit,
    updateHabitVisibility,
  });

  return (
    <>
      <ReorderableList
        elementConstructors={elementConstructors}
        height={50}
        width={350}
        onIndexChange={(newIndicesById, changedId) => {
          updateHabitOrder(changedId, newIndicesById[changedId]);
          setReorderingList(false);
        }}
        clampMovement
        activeClass="list-item-being-reordered"
      />
      <AddHabitForm
        allowTabTraversal={allowTabTraversal}
        habits={habits}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        addHabit={addHabit}
        setInInput={setInInput}
      />
    </>
  );
}
