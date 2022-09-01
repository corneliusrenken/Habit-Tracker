/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { getTodaysIndex, getWeekDates } from '../customDateFuncs';
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
  border: 1px solid #CC4445;
`;

type WeekDatesProps = {
  today: Date;
};

function WeekDates({ today }: WeekDatesProps) {
  const weekDates = getWeekDates(today, 1);
  const todaysIndex = getTodaysIndex(today, 1);

  return (
    <WeekDatesContainer>
      {weekDates.map((date) => (
        <Date
          key={date}
        >
          {date}
        </Date>
      ))}
      <DateSelectorContainer
        offset={todaysIndex}
      >
        <DateSelector />
      </DateSelectorContainer>
    </WeekDatesContainer>
  );
}

export default WeekDates;
