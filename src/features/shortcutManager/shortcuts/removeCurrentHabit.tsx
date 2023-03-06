import React from 'react';
import createDeleteHabitModalGenerator from '../../deleteHabitModal';
import { Habit, ModalGenerator } from '../../../globalTypes';

type States = {
  selectedHabits: Habit[];
  selectedIndex: number | null;
  setModal: React.Dispatch<React.SetStateAction<ModalGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function removeCurrentHabit({
  selectedHabits,
  selectedIndex,
  setModal,
  deleteHabit,
}: States) {
  if (selectedIndex === selectedHabits.length || selectedIndex === null) return;

  const selectedHabit = selectedHabits[selectedIndex];

  const modalGenerator: ModalGenerator = createDeleteHabitModalGenerator(selectedHabit, {
    deleteHabit,
    setModal,
  });
  setModal(() => modalGenerator);
}
