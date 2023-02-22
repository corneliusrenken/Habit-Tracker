import openDeleteHabitModal from '../../deleteHabitModal/openDeleteHabitModal';
import { Habit, ModalContentGenerator } from '../../../globalTypes';

type States = {
  selectedHabits: Habit[];
  selectedIndex: number | null;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function removeCurrentHabit(states: States) {
  const {
    selectedHabits,
    selectedIndex,
  } = states;

  if (selectedIndex === selectedHabits.length || selectedIndex === null) return;

  const selectedHabit = selectedHabits[selectedIndex];
  openDeleteHabitModal(selectedHabit, states);
}
