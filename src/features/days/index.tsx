import React, { memo } from 'react';
import {
  DateObject,
  OccurrenceData,
  View,
  viewToViewType,
} from '../../globalTypes';
import getSelectedOccurrences from '../selectedData/getSelectedOccurrences';

type Props = {
  view: View;
  dateObject: DateObject;
  occurrenceData: OccurrenceData;
};

function Days({ view, dateObject, occurrenceData }: Props) {
  const weekOccurrences = getSelectedOccurrences({
    dateObject,
    occurrenceData,
    view,
  }).slice(-7);

  return (
    <div className="days" style={{ opacity: viewToViewType[view.name] === 'list' ? 1 : 0 }}>
      {dateObject.weekDays.map(((day, index) => {
        const { complete } = weekOccurrences[index];
        let className = 'days-day';
        if (complete) className += ' complete';

        return (
          <div
            key={index} // eslint-disable-line react/no-array-index-key
            className={className}
          >
            {day}
          </div>
        );
      }))}
    </div>
  );
}

export default memo(Days);
