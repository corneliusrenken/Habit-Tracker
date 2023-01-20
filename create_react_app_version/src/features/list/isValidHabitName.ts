import { Habit } from '../../globalTypes';

type States = {
  habits: Habit[];
};

export default function isValidHabitName(newName: string, states: States) {
  const { habits } = states;

  const trimmedName = newName.trim();

  if (newName !== trimmedName) throw new Error('New name needs to be trimmed before passing into validation function');

  const isUnique = habits.find(({ name }) => name === trimmedName) === undefined;

  if (!trimmedName) return 'The habit name needs to contain at least one letter';
  if (!isUnique) return 'A habit with this name already exists';
  return true;
}
