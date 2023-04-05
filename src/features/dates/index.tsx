import React, { memo } from 'react';
import { DateObject, View, SelectedOccurrence } from '../../globalTypes';

type Props = {
  view: View;
  dateObject: DateObject;
  selectedOccurrences: SelectedOccurrence[];
};

function Dates({ dateObject, view, selectedOccurrences }: Props) {
  const selectedDayIndex = view.name !== 'yesterday'
    ? dateObject.today.weekDayIndex
    : dateObject.yesterday.weekDayIndex;

  const weekOccurrences = selectedOccurrences.slice(-7);

  let dayIndicatorClassName = 'day-indicator';
  if (weekOccurrences[selectedDayIndex].complete) dayIndicatorClassName += ' complete';

  return (
    <div className="dates">
      {weekOccurrences.map(({ date, fullDate, complete }) => {
        let dateClassName = 'date';
        if (complete) dateClassName += ' complete';

        return (
          <div
            key={fullDate}
            className={dateClassName}
          >
            {complete ? '*' : date}
          </div>
        );
      })}
      <div className={dayIndicatorClassName} style={{ left: `${selectedDayIndex * 50}px` }} />
    </div>
  );
}

export default memo(Dates);
