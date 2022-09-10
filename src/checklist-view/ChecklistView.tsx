import React from 'react';
import styled from 'styled-components';
import Checklist from './Checklist';
import {
  CompletedDays, DateInfo, HabitWithOffset, Streaks,
} from '../types';
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
  dateInfo: DateInfo;
  completedDays: CompletedDays | undefined;
  streaks: Streaks;
};

function ChecklistView({
  habits, toggleHabitComplete, dateInfo, completedDays, streaks,
}: ChecklistViewProps) {
  if (completedDays === undefined) {
    return <div />;
  }

  return (
    <ChecklistViewContainer
      habitCount={habits.length}
    >
      <WeekDays
        dateInfo={dateInfo}
        completedDays={completedDays}
      />
      <WeekDates
        dateInfo={dateInfo}
        completedDays={completedDays}
      />
      <Checklist
        dateInfo={dateInfo}
        habits={habits}
        toggleHabitComplete={toggleHabitComplete}
        streaks={streaks}
      />
    </ChecklistViewContainer>
  );
}

export default ChecklistView;
