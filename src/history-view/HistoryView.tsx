import React, { useEffect } from 'react';
import styled from 'styled-components';
import { getDifferenceInDays, toCustomDateString } from '../customDateFuncs';
import { DateInfo, Theme } from '../types';
import { gridHeightInPx, gridWidthInPx } from '../universalStyling';

const HistoryViewContainer = styled.div`
  position: relative;
`;

const DateContainer = styled.div`
  width: ${gridWidthInPx * 7}px;
  margin: 0 auto;
  ${({ daysDisplayed }: { daysDisplayed: number }) => {
    const lines = Math.ceil(daysDisplayed / 7);
    return `
      height: ${gridHeightInPx * lines}px;
    `;
  }}
`;

const Spacer = styled.div`
  ${({ daysDisplayed }: { daysDisplayed: number }) => {
    const lines = Math.ceil(daysDisplayed / 7);
    return `
      height: max(50vh - ${(gridHeightInPx * lines) / 2}px, ${gridHeightInPx * 2}px);
    `;
  }}
  width: 100%;
  background-color: white;
  position: sticky;
`;

const Header = styled(Spacer)`
  top: 0;
`;

const DateComponent = styled.div`
  height: ${gridHeightInPx}px;
  width: ${gridWidthInPx}px;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${({ complete, theme }: { complete: boolean, theme: Theme }) => `
    ${complete ? `color: ${theme.secondary};` : ''}
  `}
`;

const getArrayOfDates = (from: string | null, until: string, dateInfo: DateInfo) => {
  let fromYear;
  let fromMonth;
  let fromDate;
  if (from) {
    [fromYear, fromMonth, fromDate] = from.split('-').map(Number);
  } else {
    [fromYear, fromMonth, fromDate] = until.split('-').map(Number);
  }
  const [untilYear, untilMonth, untilDate] = until.split('-').map(Number);

  const currentDate = new Date(dateInfo.today);
  currentDate.setFullYear(untilYear);
  currentDate.setMonth((untilMonth + 11) % 12);
  currentDate.setDate(untilDate);

  const finalDate = new Date(dateInfo.today);
  finalDate.setFullYear(fromYear);
  finalDate.setMonth((fromMonth + 11) % 12);
  finalDate.setDate(fromDate);

  const dates: Array<Date> = [];

  currentDate.setDate(currentDate.getDate() - 7);

  while (currentDate.getTime() >= finalDate.getTime() || dates.length % 7 !== 0) {
    dates.push(new Date(currentDate));

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return dates.reverse();
};

type HistoryViewProps = {
  dateInfo: DateInfo;
  from: string | null;
  until: string;
  complete: {
    [date: string]: boolean;
  }
};

function HistoryView({
  dateInfo, from, until, complete,
}: HistoryViewProps) {
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  }, [from, until]);

  const daysDisplayed = from ? getDifferenceInDays(from, until) + 1 - 7 : 0;
  return (
    <HistoryViewContainer>
      <Header
        daysDisplayed={daysDisplayed}
      />
      <DateContainer
        daysDisplayed={daysDisplayed}
      >
        {getArrayOfDates(from, until, dateInfo).map((date) => {
          const dateString = toCustomDateString(date);
          return (
            <DateComponent
              key={dateString}
              complete={complete[dateString]}
            >
              {date.getDate()}
            </DateComponent>
          );
        })}
      </DateContainer>
    </HistoryViewContainer>
  );
}

export default HistoryView;
