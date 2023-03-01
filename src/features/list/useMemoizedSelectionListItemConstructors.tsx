import React, { useMemo } from 'react';
import {
  DateObject,
  Habit,
  ModalContentGenerator,
  OccurrenceData,
} from '../../globalTypes';
import openDeleteHabitModal from '../deleteHabitModal/openDeleteHabitModal';
import { ElementConstructor } from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type States = {
  ignoreMouse: boolean;
  ignoreTabIndices: boolean;
  dateObject: DateObject;
  occurrenceData: OccurrenceData;
  habits: Habit[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedSelectionListItemConstructors({
  ignoreMouse,
  ignoreTabIndices,
  dateObject,
  occurrenceData,
  habits,
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
            ignoreTabIndices={ignoreTabIndices}
            name={habit.name}
            move={(e) => {
              onMouseDown(e);
              setReorderingList(true);
            }}
            visible={visible}
            selected={selectedIndex === index}
            select={reorderingList || inInput ? undefined : () => setSelectedIndex(index)}
            toggleVisibility={() => updateOccurrenceVisibility(habit.id, !visible)}
            openDeleteHabitModal={() => openDeleteHabitModal(habit, {
              deleteHabit,
              setModalContentGenerator,
            })}
            renameHabit={(newName: string) => {
              updateHabitName(habit.id, newName);
            }}
            inInput={inInput}
            setInInput={setInInput}
            habits={habits}
          />
        );
      },
    }))
  ), [
    ignoreMouse,
    ignoreTabIndices,
    dateObject,
    occurrenceData,
    habits,
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
  ]);
}
