import React from 'react';
import styled from 'styled-components';
import { Habit } from '../types';
import { gridHeightInPx } from '../universalStyling';

type ChecklistItemProps = {
  habit: Habit;
};

const ChecklistItemContainer = styled.div`
  height: ${gridHeightInPx}px;
  position: absolute;
  ${({ order }: { order: number }) => `
    top: ${gridHeightInPx * order}px;
  `}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transition: top 1s;
`;

function ChecklistItem({ habit }: ChecklistItemProps) {
  return (
    <ChecklistItemContainer
      key={habit.id}
      order={habit.order}
    >
      <p>{habit.name}</p>
      <p>{habit.dayStreak}</p>
    </ChecklistItemContainer>
  );
}

export default ChecklistItem;
