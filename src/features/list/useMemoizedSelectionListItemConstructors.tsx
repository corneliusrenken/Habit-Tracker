import React, { useMemo } from 'react';
import { Habit, OccurrenceData } from '../../globalTypes';
import { ElementConstructor } from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type States = {
  allowTabTraversal: boolean;
  habits: Habit[];
  todaysOccurrences: OccurrenceData['dates'][string];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  reorderingList: boolean;
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  deleteHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedSelectionListItemConstructors(states: States) {
  return useMemo<ElementConstructor[]>(() => {
    const {
      allowTabTraversal,
      habits,
      todaysOccurrences,
      selectedIndex,
      setSelectedIndex,
      inInput,
      setInInput,
      reorderingList,
      setReorderingList,
      deleteHabit,
      renameHabit,
      updateHabitVisibility,
    } = states;

    return habits.map(({ id, name }, index) => ({
      id,
      elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
        const visible = todaysOccurrences[id]?.visible;

        return (
          <SelectionListItem
            allowTabTraversal={allowTabTraversal}
            name={name}
            move={(e) => {
              onMouseDown(e);
              setReorderingList(true);
            }}
            visible={visible}
            selected={selectedIndex === index}
            select={reorderingList || inInput ? undefined : () => setSelectedIndex(index)}
            toggleVisibility={() => updateHabitVisibility(id, !visible)}
            deleteHabit={() => deleteHabit(id)}
            renameHabit={(newName: string) => {
              renameHabit(id, newName);
            }}
            inInput={inInput}
            setInInput={setInInput}
            habits={habits}
          />
        );
      },
    }));
  }, [states]);
}
