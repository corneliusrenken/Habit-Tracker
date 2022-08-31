import React from 'react';
import styled from 'styled-components';
import { Habit } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

type ChecklistItemProps = {
  habit: Habit;
  selected: boolean;
};

const ChecklistItemContainer = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx * 7}px;
  position: absolute;
  ${({ order, selected }: { order: number, selected: boolean }) => `
    top: ${gridHeightInPx * order}px;
    padding-left: ${selected ? '10px' : '0'};
  `}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transition: top 1s;
`;

function ChecklistItem({ habit, selected }: ChecklistItemProps) {
  return (
    <ChecklistItemContainer
      order={habit.order}
      selected={selected}
    >
      <p>{habit.name}</p>
      <p>{habit.dayStreak}</p>
    </ChecklistItemContainer>
  );
}

export default ChecklistItem;
