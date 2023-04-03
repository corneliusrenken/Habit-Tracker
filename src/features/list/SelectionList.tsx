import React, { useCallback } from 'react';
import {
  DateObject,
  Habit,
  ModalGenerator,
  OccurrenceData,
} from '../../globalTypes';
import AddHabitForm from './AddHabitForm';
import ReorderableList from './ReorderableList';
import SelectionListItem from './SelectionListItem';

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
  const prepopulatedListItem = useCallback((
    habit: Habit,
    position: number,
    reorder: (e: React.MouseEvent) => void,
    styleAdditions: React.CSSProperties = {},
    classNameAdditions = '',
  ) => {
    const visible = (
      occurrenceData.dates[dateObject.today.dateString][habit.id]
      && occurrenceData.dates[dateObject.today.dateString][habit.id].visible
    );

    return (
      <SelectionListItem
        key={habit.id}
        styleAdditions={styleAdditions}
        classNameAdditions={classNameAdditions}
        ignoreMouse={ignoreMouse}
        habit={habit}
        move={(e) => {
          reorder(e);
          setReorderingList(true);
        }}
        visible={visible}
        selected={selectedIndex === position}
        select={reorderingList || inInput ? undefined : () => setSelectedIndex(position)}
        toggleVisibility={() => updateOccurrenceVisibility(habit.id, !visible)}
        renameHabit={(newName: string) => updateHabitName(habit.id, newName)}
        inInput={inInput}
        setInInput={setInInput}
        habits={habits}
        deleteHabit={deleteHabit}
        setModal={setModal}
      />
    );
  }, [
    dateObject.today.dateString,
    deleteHabit,
    habits,
    ignoreMouse,
    inInput,
    occurrenceData.dates,
    reorderingList,
    selectedIndex,
    setInInput,
    setModal,
    setReorderingList,
    setSelectedIndex,
    updateHabitName,
    updateOccurrenceVisibility,
  ]);

  return (
    <>
      <ReorderableList
        prepopulatedListItem={prepopulatedListItem}
        habits={habits}
        setReorderingList={setReorderingList}
        updateHabitListPosition={updateHabitListPosition}
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
