import React from 'react';
import styled from 'styled-components';
import { Habit } from './types';
import { gridHeightInPx } from './universalStyling';

type ChecklistItemProps = {
  habit: Habit;
};

const ChecklistItemContainer = styled.div`
  height: ${gridHeightInPx}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

function ChecklistItem({ habit }: ChecklistItemProps) {
  return (
    <ChecklistItemContainer key={habit.id}>
      <p>{habit.name}</p>
      <p>{habit.dayStreak}</p>
    </ChecklistItemContainer>
  );
}

export default ChecklistItem;
