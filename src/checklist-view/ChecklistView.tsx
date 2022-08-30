import React from 'react';
import styled from 'styled-components';
import Checklist from './Checklist';
import { Habit } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const ChecklistViewContainer = styled.div`
  width: ${gridWidthInPx * 7}px;
  margin: 0 auto;
  ${({ habitCount }: { habitCount: number }) => `
    margin-bottom: calc(50vh - ${((habitCount + 2) * gridHeightInPx) / 2}px);
  `}
`;

type ChecklistViewProps = {
  habits: Array<Habit>;
};

function ChecklistView({ habits }: ChecklistViewProps) {
  return (
    <ChecklistViewContainer
      habitCount={habits.length}
    >
      <div style={{ height: `${gridHeightInPx}px`, backgroundColor: 'lime' }}>
        Days
      </div>
      <div style={{ height: `${gridHeightInPx}px`, backgroundColor: 'lime' }}>
        Dates
      </div>
      <Checklist
        habits={habits}
      />
    </ChecklistViewContainer>
  );
}

export default ChecklistView;
