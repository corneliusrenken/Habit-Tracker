import React, { useEffect, useRef, useState } from 'react';
import { DateObject, Habit } from '../../globalTypes';
import isValidHabitName from './isValidHabitName';

type Props = {
  dateObject: DateObject;
  allowTabTraversal: boolean;
  habits: Habit[];
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setInInput: React.Dispatch<React.SetStateAction<boolean>>;
  addHabit: (name: string, id: number) => Promise<void>;
};

export default function AddHabitForm({
  dateObject,
  allowTabTraversal,
  habits,
  selectedIndex,
  setSelectedIndex,
  addHabit,
  setInInput,
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
      onSubmit={async (e) => {
        e.preventDefault();
        const trimmedHabitInput = habitInput.trim();
        const validation = isValidHabitName(trimmedHabitInput, { habits });
        if (validation === true) {
          const newHabit = await window.electron['add-habit'](trimmedHabitInput, dateObject.today.dateString);
          addHabit(trimmedHabitInput, newHabit.id);
          setHabitInput('');
        } else {
          console.error(validation); // eslint-disable-line no-console
        }
      }}
    >
      <input
        tabIndex={allowTabTraversal ? undefined : -1}
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
          setHabitInput('');
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
