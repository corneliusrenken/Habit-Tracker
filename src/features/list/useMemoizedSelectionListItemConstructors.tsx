import React, { useMemo } from 'react';
import {
  DateObject,
  Habit,
  ModalGenerator,
  OccurrenceData,
} from '../../globalTypes';
import { ElementConstructor } from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type States = {
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
  deleteHabit: (habitId: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedSelectionListItemConstructors({
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
}: States) {
  return useMemo<ElementConstructor[]>(() => (
    habits.map((habit, index) => ({
      id: habit.id,
      elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
        // const visible = occurrenceData.dates[habit.id]?.visible;
        const visible = (
          occurrenceData.dates[dateObject.today.dateString][habit.id]
          && occurrenceData.dates[dateObject.today.dateString][habit.id].visible
        );
        return (
          <SelectionListItem
            ignoreMouse={ignoreMouse}
            disableTabIndex={disableTabIndex}
            habit={habit}
            move={(e) => {
              onMouseDown(e);
              setReorderingList(true);
            }}
            visible={visible}
            selected={selectedIndex === index}
            select={reorderingList || inInput ? undefined : () => setSelectedIndex(index)}
            toggleVisibility={() => updateOccurrenceVisibility(habit.id, !visible)}
            renameHabit={(newName: string) => {
              updateHabitName(habit.id, newName);
            }}
            inInput={inInput}
            setInInput={setInInput}
            habits={habits}
            deleteHabit={deleteHabit}
            setModal={setModal}
          />
        );
      },
    }))
  ), [
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
  ]);
}
