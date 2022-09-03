import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChecklistItem from './ChecklistItem';
import { HabitWithOffset } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

type ChecklistProps = {
  habits: Array<HabitWithOffset>;
  toggleHabitComplete: Function;
};

const ChecklistContainer = styled.div`
  position: relative;
  ${({ habitLength }: { habitLength: number }) => `
    height: ${habitLength * gridHeightInPx}px;
  `}
`;

const Selector = styled.div`
  position: absolute;
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx * 7}px;
  background-color: #e2e2e2;
  top: ${({ selectedIndex }: { selectedIndex: number }) => selectedIndex * gridHeightInPx}px;
  transition: top 0.2s;
`;

function Checklist({ habits, toggleHabitComplete }: ChecklistProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setSelectedIndex((selectedIndex + habits.length - 1) % habits.length);
        e.preventDefault();
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        setSelectedIndex((selectedIndex + 1) % habits.length);
        e.preventDefault();
      }
      if (e.key === 'Enter' || e.key === 'e') {
        const currentID = habits[habits.findIndex((habit) => selectedIndex === habit.offset)].id;
        toggleHabitComplete(currentID);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [habits, toggleHabitComplete, selectedIndex]);

  return (
    <ChecklistContainer
      habitLength={habits.length}
    >
      {habits.map((habit) => (
        <ChecklistItem
          key={habit.id}
          habit={habit}
          setSelectedIndex={setSelectedIndex}
          toggleComplete={() => toggleHabitComplete(habit.id)}
        />
      ))}
      <Selector
        selectedIndex={selectedIndex}
      />
    </ChecklistContainer>
  );
}

export default Checklist;
