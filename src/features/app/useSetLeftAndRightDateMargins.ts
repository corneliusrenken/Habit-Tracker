import { useEffect } from 'react';
import { SelectedOccurrence } from '../../globalTypes';
import getTextWidthInPx from './getTextWidthInPx';

type States = {
  selectedOccurrences: SelectedOccurrence[];
};

export default function useSetLeftAndRightDateMargins({ selectedOccurrences }: States) {
  const firstDateOfWeek = selectedOccurrences[selectedOccurrences.length - 1].date;
  const lastDateOfWeek = selectedOccurrences[selectedOccurrences.length - 7].date;

  useEffect(() => {
    document.documentElement.style.setProperty('--left-margin', `${(50 - getTextWidthInPx(firstDateOfWeek, 15)) / 2}px`);
    document.documentElement.style.setProperty('--right-margin', `${(50 - getTextWidthInPx(lastDateOfWeek, 15)) / 2}px`);
  }, [firstDateOfWeek, lastDateOfWeek]);
}
