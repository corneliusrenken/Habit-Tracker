import { Habit } from '../../globalTypes';

type States = {
  habits: Habit[];
};

/**
 * @returns an empty string if the name is valid, otherwise a string with the error message
 */
export default function getInputValidationError(name: string, { habits }: States) {
  const isUnique = !habits.some((habit) => habit.name === name);

  if (!isUnique) return 'A habit with this name already exists';
  if (name === '') return 'Habit name needs to be non-empty';
  return '';
}
