import React, { useMemo } from 'react';
import { Habit, ModalContentGenerator, OccurrenceData } from '../../globalTypes';
import openDeleteHabitModal from '../deleteHabitModal/openDeleteHabitModal';
import { ElementConstructor } from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type States = {
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
  deleteHabit: (habitId: number) => void;
  updateHabitName: (habitId: number, newName: string) => void;
  updateOccurrenceVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedSelectionListItemConstructors({
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
}: States) {
  return useMemo<ElementConstructor[]>(() => (
    habits.map((habit, index) => ({
      id: habit.id,
      elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
        const visible = todaysOccurrences[habit.id]?.visible;

        return (
          <SelectionListItem
            ignoreMouse={ignoreMouse}
            allowTabTraversal={allowTabTraversal}
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
  ]);
}
