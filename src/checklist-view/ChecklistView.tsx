import React from 'react';
import styled from 'styled-components';
import Checklist from './Checklist';
import { HabitWithOffset } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';
import WeekDays from './WeekDays';
import WeekDates from './WeekDates';

const ChecklistViewContainer = styled.div`
  width: ${gridWidthInPx * 7}px;
  margin: 0 auto;
  ${({ habitCount }: { habitCount: number }) => `
    margin-top: calc(50vh - ${((habitCount + 2) * gridHeightInPx) / 2}px);
  `}
`;

type ChecklistViewProps = {
  habits: Array<HabitWithOffset>;
  toggleHabitComplete: Function;
  today: Date;
};

function ChecklistView({ habits, toggleHabitComplete, today }: ChecklistViewProps) {
  return (
    <ChecklistViewContainer
      habitCount={habits.length}
    >
      <WeekDays />
      <WeekDates
        today={today}
      />
      <Checklist
        habits={habits}
        toggleHabitComplete={toggleHabitComplete}
      />
    </ChecklistViewContainer>
  );
}

export default ChecklistView;
