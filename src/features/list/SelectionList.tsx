import React from 'react';
import {
  DateObject,
  Habit,
  ModalGenerator,
  OccurrenceData,
} from '../../globalTypes';
import AddHabitForm from './AddHabitForm';
import ReorderableList from './ReorderableList';
import useMemoizedSelectionListItemConstructors from './useMemoizedSelectionListItemConstructors';

type Props = {
  ignoreMouse: boolean;
  disableTabIndex: boolean;
  dateObject: DateObject;
  occurrenceData: OccurrenceData;
  habits: Habit[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  addHabit: (name: string) => void;
  deleteHabit: (habitId: number) => void;
  updateHabitListPosition: (habitId: number, newPosition: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function SelectionList({
  ignoreMouse,
  disableTabIndex,
  dateObject,
  occurrenceData,
  habits,
  selectedIndex,
  setSelectedIndex,
  inInput,
  setInInput,
  reorderingList,
  setReorderingList,
  setModal,
  addHabit,
  deleteHabit,
  updateHabitListPosition,
  updateHabitName,
  updateOccurrenceVisibility,
}: Props) {
  const elementConstructors = useMemoizedSelectionListItemConstructors({
    ignoreMouse,
    disableTabIndex,
    dateObject,
    occurrenceData,
    habits,
    selectedIndex,
    setSelectedIndex,
    inInput,
    setInInput,
    reorderingList,
    setReorderingList,
    setModal,
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
        disableTabIndex={disableTabIndex}
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
