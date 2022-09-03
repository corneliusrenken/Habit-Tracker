import React from 'react';
import styled from 'styled-components';
import { toCustomDateString } from '../customDateFuncs';
import { CompletedDays, DateInfo, Theme } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const WeekDatesContainer = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx * 7}px;
  position: relative;
  `;

const Date = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx}px;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${({ complete, theme }: { complete: boolean, theme: Theme }) => `
    ${complete ? `color: ${theme.secondary};` : ''}
  `}
`;

const DateSelectorContainer = styled.div`
  position: absolute;
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx}px;
  top: 0;
  left: ${({ offset }: { offset: number }) => offset * gridWidthInPx}px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: left 0.5s;
`;

const DateSelector = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  ${({ theme }: { theme: Theme }) => `
    border: 1px solid ${theme.tertiary};
  `}
`;

type WeekDatesProps = {
  dateInfo: DateInfo;
  completedDays: CompletedDays;
};

function WeekDates({ dateInfo, completedDays }: WeekDatesProps) {
  return (
    <WeekDatesContainer>
      {dateInfo.weekDates.map((date) => (
        <Date
          key={date.getDate()}
          complete={!!completedDays.completed[toCustomDateString(date)]}
        >
          {date.getDate()}
        </Date>
      ))}
      <DateSelectorContainer
        offset={dateInfo.todaysIndex}
      >
        <DateSelector />
      </DateSelectorContainer>
    </WeekDatesContainer>
  );
}

export default WeekDates;
