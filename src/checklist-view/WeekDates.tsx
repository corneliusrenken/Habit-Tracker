import React from 'react';
import styled from 'styled-components';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const WeekDate = styled.div`
  width: ${gridWidthInPx}px;
  height: ${gridHeightInPx}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

function WeekDates() {
  const weekDates = ['29', '30', '31', '1', '2', '3', '4'];

  return (
    <div>
      {weekDates.map((date) => (
        <WeekDate>
          {date}
        </WeekDate>
      ))}
    </div>
  );
}

export default WeekDates;
