import React from 'react';
import styled from 'styled-components';
import { HabitWithOffset, Theme } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

type Padding = {
  left: number;
  right: number;
};

type ChecklistItemProps = {
  habit: HabitWithOffset;
  setSelectedIndex: Function;
  toggleComplete: Function;
  usingMouse: boolean;
  padding: Padding;
};

const ChecklistItemContainer = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx * 7}px;
  position: absolute;
  ${({
    offset, complete, padding, theme,
  }: {
    offset: number, complete: boolean, padding: Padding, theme: Theme,
  }) => `
    color: ${complete ? theme.secondary : theme.primary};
    top: ${gridHeightInPx * offset}px;
    padding-right: ${padding.right}px;
    padding-left: ${padding.left}px;
  `}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transition: top 0.5s;
  z-index: 1;
  cursor: pointer;
`;

function ChecklistItem({
  habit, setSelectedIndex, toggleComplete, usingMouse, padding,
}: ChecklistItemProps) {
  return (
    <ChecklistItemContainer
      offset={habit.offset}
      complete={habit.complete}
      padding={padding}
      onMouseEnter={() => {
        if (usingMouse) {
          setSelectedIndex(habit.offset);
        }
      }}
      onClick={() => toggleComplete()}
    >
      <p>{habit.name}</p>
      <p>3</p>
    </ChecklistItemContainer>
  );
}

export default ChecklistItem;
