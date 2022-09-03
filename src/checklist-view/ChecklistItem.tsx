import React from 'react';
import styled from 'styled-components';
import { HabitWithOffset } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

type ChecklistItemProps = {
  habit: HabitWithOffset;
  setSelectedIndex: Function;
  toggleComplete: Function;
};

const ChecklistItemContainer = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx * 7}px;
  position: absolute;
  ${({ offset, complete }: { offset: number, complete: boolean }) => `
    color: ${complete ? 'gray' : 'black'};
    top: ${gridHeightInPx * offset}px;
  `}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transition: top 0.5s;
  z-index: 1;
`;

function ChecklistItem({ habit, setSelectedIndex, toggleComplete }: ChecklistItemProps) {
  return (
    <ChecklistItemContainer
      offset={habit.offset}
      complete={habit.complete}
      onMouseEnter={() => setSelectedIndex(habit.offset)}
      onClick={() => toggleComplete()}
    >
      <p>{habit.name}</p>
      <p>3</p>
    </ChecklistItemContainer>
  );
}

export default ChecklistItem;
