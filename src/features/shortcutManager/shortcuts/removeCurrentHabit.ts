import openDeleteHabitModal from '../../deleteHabitModal/openDeleteHabitModal';
import { Habit, ModalContentGenerator } from '../../../globalTypes';

type States = {
  habits: Habit[] | undefined;
  selectedIndex: number | null;
  setModalContentGenerator: React.Dispatch<React.SetStateAction<ModalContentGenerator | undefined>>;
  deleteHabit: (habitId: number) => void;
};

export default function removeCurrentHabit(states: States) {
  const {
    habits,
    selectedIndex,
  } = states;

  if (!habits || selectedIndex === habits.length) return;
  const selectedHabit = habits.find((habit, index) => index === selectedIndex);
  if (!selectedHabit) throw new Error('no habit found at selected index');
  openDeleteHabitModal(selectedHabit.id, states);
}
