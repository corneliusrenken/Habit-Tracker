import React from 'react';
import styled from 'styled-components';
import { toCustomDateString } from '../customDateFuncs';
import { CompletedDays, DateInfo, Theme } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const WeekDay = styled.div`
  width: ${gridWidthInPx}px;
  height: ${gridHeightInPx}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  ${({ complete, theme }: { complete: boolean, theme: Theme }) => `
    ${complete ? `color: ${theme.secondary};` : ''}
  `}
`;

type WeekDaysProps = {
  dateInfo: DateInfo;
  completedDays: CompletedDays;
};

function WeekDays({ dateInfo, completedDays }: WeekDaysProps) {
  return (
    <div>
      {dateInfo.weekDays.map((day, index) => (
        <WeekDay
          key={`${day + index}`}
          complete={!!completedDays.completed[toCustomDateString(dateInfo.weekDates[index])]}
        >
          {day}
        </WeekDay>
      ))}
    </div>
  );
}

export default WeekDays;
