import React from 'react';
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
  return (
    <ChecklistContainer
      habitLength={habits.length}
    >
      {habits.map((habit) => (
        <ChecklistItem habit={habit} />
      ))}
    </ChecklistContainer>
  );
}

export default Checklist;
