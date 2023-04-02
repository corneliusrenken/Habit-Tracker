import React from 'react';
import {
  DateObject,
  Habit,
  ModalGenerator,
  OccurrenceData,
} from '../../globalTypes';
import AddHabitForm from './AddHabitForm';
import ReorderableList from './ReorderableList';

type Props = {
  ignoreMouse: boolean;
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
  return (
    <>
      <ReorderableList
        ignoreMouse={ignoreMouse}
        dateObject={dateObject}
        occurrenceData={occurrenceData}
        habits={habits}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        inInput={inInput}
        setInInput={setInInput}
        reorderingList={reorderingList}
        setReorderingList={setReorderingList}
        setModal={setModal}
        deleteHabit={deleteHabit}
        updateHabitListPosition={updateHabitListPosition}
        updateHabitName={updateHabitName}
        updateOccurrenceVisibility={updateOccurrenceVisibility}
      />
      <AddHabitForm
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
