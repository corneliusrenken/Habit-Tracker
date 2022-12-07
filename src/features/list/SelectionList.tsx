import React from 'react';
import { ApiFunctions, Habit } from '../../globalTypes';
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
  apiFunctions: ApiFunctions;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SelectionList({
  habits, todaysOccurrences, selectedIndex, setSelectedIndex, apiFunctions, inInput, setInInput,
}: Props) {
  const elementConstructors: ElementConstructor[] = habits.map(({ id, name }, index) => ({
    id,
    elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => {
      const visible = todaysOccurrences[id] !== undefined;

      return () => (
        <SelectionListItem
          name={name}
          move={onMouseDown}
          visible={visible}
          selected={selectedIndex === index}
          toggleVisibility={() => apiFunctions.updateHabitVisibility(id, !visible)}
          removeHabit={() => apiFunctions.removeHabit(id)}
          renameHabit={(newName: string) => {
            apiFunctions.renameHabit(id, newName);
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
          apiFunctions.updateHabitOrder(changedId, newIndicesById[changedId]);
        }}
      />
      <AddHabitForm
        habits={habits}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        apiFunctions={apiFunctions}
        setInInput={setInInput}
      />
    </>
  );
}
