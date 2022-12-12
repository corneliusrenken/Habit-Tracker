import React from 'react';
import { Habit } from '../../globalTypes';
import AddHabitForm from './AddHabitForm';
import ReorderableList from './ReorderableList';
import SelectionListItem from './SelectionListItem';

type ElementConstructor = {
  id: number;
  // eslint-disable-next-line max-len
  elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => () => JSX.Element;
};

type Props = {
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
  const elementConstructors: ElementConstructor[] = habits.map(({ id, name }, index) => ({
    id,
    elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
      const visible = todaysOccurrences[id] !== undefined;

      return () => (
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
        habits={habits}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        addHabit={addHabit}
        setInInput={setInInput}
      />
    </>
  );
}
