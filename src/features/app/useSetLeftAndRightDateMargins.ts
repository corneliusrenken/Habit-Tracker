import { useEffect } from 'react';
import { DateObject, View } from '../../globalTypes';
import getTextWidthInPx from './getTextWidthInPx';

type States = {
  dateObject: DateObject;
  view: View;
};

export default function useSetLeftAndRightDateMargins({ dateObject, view }: States) {
  useEffect(() => {
    const weekDates = view.name === 'yesterday'
      ? dateObject.yesterday.weekDateStrings
      : dateObject.today.weekDateStrings;

    const firstDateOfWeek = Number(weekDates[0].slice(-2));
    const lastDateOfWeek = Number(weekDates[6].slice(-2));

    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDateOfWeek, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDateOfWeek, 15)) / 2}px`);
  }, [dateObject, view]);
}
