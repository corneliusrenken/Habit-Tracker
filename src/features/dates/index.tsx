import React, { memo } from 'react';
import { DateObject, View, OccurrenceData } from '../../globalTypes';
import getSelectedOccurrences from '../selectedData/getSelectedOccurrences';

type Props = {
  view: View;
  dateObject: DateObject;
  occurrenceData: OccurrenceData;
};

function Dates({ dateObject, view, occurrenceData }: Props) {
  const selectedDayIndex = view.name !== 'yesterday'
    ? dateObject.today.weekDayIndex
    : dateObject.yesterday.weekDayIndex;

  const weekOccurrences = getSelectedOccurrences({
    dateObject,
    occurrenceData,
    view,
  }).slice(-7);

  let dayIndicatorClassName = 'dates-day-indicator';
  if (weekOccurrences[selectedDayIndex].complete) dayIndicatorClassName += ' complete';

  return (
    <div className="dates">
      {weekOccurrences.map(({ date, fullDate, complete }) => {
        let dateClassName = 'dates-date';
        if (complete) dateClassName += ' complete';

        return (
          <div
            key={fullDate}
            className={dateClassName}
          >
            {date}
          </div>
        );
      })}
      <div
        className={dayIndicatorClassName}
        style={{ left: `calc(${selectedDayIndex} * 50px)` }}
      />
    </div>
  );
}

export default memo(Dates);
