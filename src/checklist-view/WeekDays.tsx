import React from 'react';
import styled from 'styled-components';
import { getWeekDays } from '../customDateFuncs';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const WeekDay = styled.div`
  width: ${gridWidthInPx}px;
  height: ${gridHeightInPx}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
`;

function WeekDays() {
  const weekDays = getWeekDays(1);

  return (
    <div>
      {weekDays.map((day, index) => (
        <WeekDay
          key={`${day + index}`}
        >
          {day}
        </WeekDay>
      ))}
    </div>
  );
}

export default WeekDays;
