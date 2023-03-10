import React from 'react';
import { Habit } from '../../globalTypes';
import CustomForm from './CustomForm';
import getInputValidationError from './getInputValidationError';

type Props = {
  habits: Habit[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  inInput: boolean;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  addHabit: (name: string) => void;
};

export default function AddHabitForm({
  habits,
  selectedIndex,
  setSelectedIndex,
  addHabit,
  inInput,
  setInInput,
}: Props) {
  // development
  // development
  // development
  if (selectedIndex === habits.length && !inInput) {
    throw new Error('inInput should never be false when form is selected');
  }

  return (
    <CustomForm
      active={selectedIndex === habits.length}
      activeOnClick
      setActive={(active) => {
        if (active) {
          setSelectedIndex(habits.length);
          setInInput(true);
        } else {
          setSelectedIndex(habits.length !== 0 ? habits.length - 1 : null);
          setInInput(false);
        }
      }}
      placeholder="Add habit"
      initialValue=""
      getInputValidationError={(name) => getInputValidationError(name, { habits })}
      onSubmit={(name) => {
        addHabit(name);
        setInInput(false);
      }}
      containerClass={(
        selectedIndex === habits.length
          ? 'list-add-habit-form selected'
          : 'list-add-habit-form'
      )}
    />
  );
}
