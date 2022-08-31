import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChecklistItem from './ChecklistItem';
import { Habit } from '../types';
import { gridHeightInPx } from '../universalStyling';

type ChecklistProps = {
  habits: Array<Habit>;
};

const ChecklistContainer = styled.div`
  position: relative;
  ${({ habitLength }: { habitLength: number }) => `
    height: ${habitLength * gridHeightInPx}px;
  `}
`;

function Checklist({ habits }: ChecklistProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setSelectedIndex((selectedIndex + habits.length - 1) % habits.length);
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        setSelectedIndex((selectedIndex + 1) % habits.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, habits.length]);

  return (
    <ChecklistContainer
      habitLength={habits.length}
    >
      {habits.map((habit, index) => (
        <ChecklistItem
          key={habit.id}
          habit={habit}
          selected={index === selectedIndex}
        />
      ))}
    </ChecklistContainer>
  );
}

export default Checklist;
