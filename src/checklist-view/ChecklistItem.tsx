import React from 'react';
import styled from 'styled-components';
import { HabitWithOffset } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

type ChecklistItemProps = {
  habit: HabitWithOffset;
  selected: boolean;
};

const ChecklistItemContainer = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx * 7}px;
  position: absolute;
  ${({ offset, selected, complete }: { offset: number, selected: boolean, complete: boolean }) => `
    color: ${complete ? 'gray' : 'black'};
    top: ${gridHeightInPx * offset}px;
    padding-left: ${selected ? '10px' : '0'};
  `}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transition: top 0.5s;
`;

function ChecklistItem({ habit, selected }: ChecklistItemProps) {
  return (
    <ChecklistItemContainer
      offset={habit.offset}
      selected={selected}
      complete={habit.complete}
    >
      <p>{habit.name}</p>
      <p>3</p>
    </ChecklistItemContainer>
  );
}

export default ChecklistItem;
