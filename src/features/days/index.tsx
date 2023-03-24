import React, { memo } from 'react';
import {
  DateObject,
  SelectedOccurrence,
  View,
  viewToViewType,
} from '../../globalTypes';

type Props = {
  view: View;
  dateObject: DateObject;
  selectedOccurrences: SelectedOccurrence[];
};

function Days({ view, dateObject, selectedOccurrences }: Props) {
  const weekOccurrences = selectedOccurrences.slice(-7);

  return (
    <div
      className="days"
      style={{ opacity: viewToViewType[view.name] === 'list' ? 1 : 0 }}
    >
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
