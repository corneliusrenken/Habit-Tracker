import React from 'react';
import styled from 'styled-components';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const WeekDay = styled.div`
  width: ${gridWidthInPx}px;
  height: ${gridHeightInPx}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

function WeekDays() {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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
