import React from 'react';
import styled from 'styled-components';
import { getWeekDates } from '../customDateFuncs';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const WeekDate = styled.div`
  width: ${gridWidthInPx}px;
  height: ${gridHeightInPx}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

type WeekDatesProps = {
  today: Date;
};

function WeekDates({ today }: WeekDatesProps) {
  const weekDates = getWeekDates(today, 1);

  return (
    <div>
      {weekDates.map((date) => (
        <WeekDate
          key={date}
        >
          {date}
        </WeekDate>
      ))}
    </div>
  );
}

export default WeekDates;
