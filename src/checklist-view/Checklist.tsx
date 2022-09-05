import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChecklistItem from './ChecklistItem';
import { DateInfo, HabitWithOffset, Theme } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

type ChecklistProps = {
  habits: Array<HabitWithOffset>;
  toggleHabitComplete: Function;
  dateInfo: DateInfo;
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
  ${({ selectedIndex, theme, usingMouse }: { selectedIndex: number, theme: Theme, usingMouse: boolean }) => `
    top: ${selectedIndex * gridHeightInPx}px;
    background-color: ${theme.secondary};
    transition: top ${usingMouse ? '0s' : '0.2s'};
  `}
`;

function Checklist({ habits, toggleHabitComplete, dateInfo }: ChecklistProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [usingMouse, setUsingMouse] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setUsingMouse(false);
        setSelectedIndex((selectedIndex + habits.length - 1) % habits.length);
        e.preventDefault();
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        setUsingMouse(false);
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
          setUsingMouse={setUsingMouse}
          padding={{
            left: (50 - dateInfo.firstDateWidthInPx) / 2,
            right: (50 - dateInfo.lastDateWidthInPx) / 2,
          }}
        />
      ))}
      <Selector
        selectedIndex={selectedIndex}
        usingMouse={usingMouse}
      />
    </ChecklistContainer>
  );
}

export default Checklist;
