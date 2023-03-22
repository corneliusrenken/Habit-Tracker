import React, { useEffect } from 'react';
import { View, viewToViewType } from '../../globalTypes';

type Props = {
  view: View;
  occurrences: JSX.Element;
  days: JSX.Element;
  dates: JSX.Element;
  list: JSX.Element;
};

const verticalMargin = '200px';

export default function Layout({
  view,
  occurrences,
  days,
  dates,
  list,
}: Props) {
  useEffect(() => {
    document.documentElement.style.setProperty('--layout-vertical-margin', verticalMargin);
  }, []);

  let layoutClassName = 'layout';

  const viewType = viewToViewType[view.name];
  layoutClassName += ` ${viewType}`;

  useEffect(() => {
    if (viewType === 'occurrence') {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      window.scrollTo(0, 0);
    }
  }, [viewType]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          height: verticalMargin,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: verticalMargin,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div className={layoutClassName}>
        <div className="layout-occurrences">{occurrences}</div>
        <div className="layout-days">{days}</div>
        <div className="layout-dates">{dates}</div>
        <div className="layout-list">{list}</div>
      </div>
    </>
  );
}
