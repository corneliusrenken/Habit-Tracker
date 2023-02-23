import React from 'react';
import { Habit, ModalContentGenerator, OccurrenceData } from '../../globalTypes';
import AddHabitForm from './AddHabitForm';
import ReorderableList from './ReorderableList';
import useMemoizedSelectionListItemConstructors from './useMemoizedSelectionListItemConstructors';

type Props = {
  ignoreMouse: boolean;
  allowTabTraversal: boolean;
  habits: Habit[];
  todaysOccurrences: OccurrenceData['dates'][string];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  addHabit: (name: string) => void;
  deleteHabit: (habitId: number) => void;
  updateHabitListPosition: (habitId: number, newPosition: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function SelectionList({
  ignoreMouse,
  allowTabTraversal,
  habits,
  todaysOccurrences,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
  reorderingList,
  setReorderingList,
  setModalContentGenerator,
  addHabit,
  deleteHabit,
  updateHabitListPosition,
  updateHabitName,
  updateOccurrenceVisibility,
}: Props) {
  const elementConstructors = useMemoizedSelectionListItemConstructors({
    ignoreMouse,
    allowTabTraversal,
    habits,
    todaysOccurrences,
    selectedIndex,
    setSelectedIndex,
    inInput,
    setInInput,
    reorderingList,
    setReorderingList,
    setModalContentGenerator,
    deleteHabit,
    updateHabitName,
    updateOccurrenceVisibility,
  });

  return (
    <>
      <ReorderableList
        elementConstructors={elementConstructors}
        height={50}
        width={350}
        onIndexChange={(newIndicesById, changedId) => {
          updateHabitListPosition(changedId, newIndicesById[changedId]);
          setReorderingList(false);
        }}
        clampMovement
        activeClass="being-reordered"
      />
      <AddHabitForm
        allowTabTraversal={allowTabTraversal}
        habits={habits}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        addHabit={addHabit}
        inInput={inInput}
        setInInput={setInInput}
      />
    </>
  );
}
