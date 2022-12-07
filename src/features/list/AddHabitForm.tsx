import React, { useEffect, useRef, useState } from 'react';
import { ApiFunctions, Habit } from '../../globalTypes';
import isValidHabitName from './isValidHabitName';

type Props = {
  habits: Habit[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  apiFunctions: ApiFunctions;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddHabitForm({
  habits, selectedIndex, setSelectedIndex, apiFunctions, setInInput,
}: Props) {
  const [habitInput, setHabitInput] = useState('');
  const habitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedIndex === habits.length) {
      habitInputRef.current?.focus();
    } else {
      habitInputRef.current?.blur();
    }
  }, [selectedIndex, habits.length]);

  return (
    <form
      style={{ top: `${habits.length * 50}px` }}
      onSubmit={(e) => {
        e.preventDefault();
        const trimmedHabitInput = habitInput.trim();
        const validation = isValidHabitName(trimmedHabitInput, { habits });
        if (validation === true) {
          apiFunctions.addHabit(trimmedHabitInput);
          setHabitInput('');
        } else {
          console.error(validation); // eslint-disable-line no-console
        }
      }}
    >
      <input
        ref={habitInputRef}
        type="text"
        placeholder="add habit"
        value={habitInput}
        onFocus={() => {
          setInInput(true);
          setSelectedIndex(habits.length);
        }}
        onBlur={() => {
          setInInput(false);
          if (habits.length === 0) {
            setSelectedIndex(null);
          } else {
            setSelectedIndex(habits.length - 1);
          }
        }}
        onChange={(e) => setHabitInput(e.target.value)}
      />
    </form>
  );
}
