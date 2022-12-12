import React, { useMemo } from 'react';
import { Habit } from '../../globalTypes';
import { ElementConstructor } from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type States = {
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
  removeHabit: (habitId: number) => void;
  renameHabit: (habitId: number, name: string) => void;
  updateHabitVisibility: (habitId: number, visible: boolean) => void;
};

export default function useMemoizedSelectionListItemConstructors(states: States) {
  return useMemo<ElementConstructor[]>(() => {
    const {
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
    } = states;

    return habits.map(({ id, name }, index) => ({
      id,
      elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
        const visible = todaysOccurrences[id] !== undefined;

        return (
          <SelectionListItem
            name={name}
            move={(e) => {
              onMouseDown(e);
              setReorderingList(true);
            }}
            visible={visible}
            selected={selectedIndex === index}
            select={reorderingList || inInput ? undefined : () => setSelectedIndex(index)}
            toggleVisibility={() => updateHabitVisibility(id, !visible)}
            removeHabit={() => removeHabit(id)}
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
