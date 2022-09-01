import React from 'react';
import styled from 'styled-components';
import { getTodaysIndex, getWeekDates } from '../customDateFuncs';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const DateContainer = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx}px;
  position: relative;
  display: inline-block;
`;

const Date = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx}px;
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateSelectorContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;  display: flex;
  justify-content: center;
  align-items: center;
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
    <div>
      {weekDates.map((date, index) => (
        <DateContainer>
          <Date
            key={date}
          >
            {date}
          </Date>
          {todaysIndex === index && (
            <DateSelectorContainer>
              <DateSelector />
            </DateSelectorContainer>
          )}
        </DateContainer>
      ))}
    </div>
  );
}

export default WeekDates;
