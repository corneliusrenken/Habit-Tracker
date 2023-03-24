import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, viewToViewType, ViewType } from '../../globalTypes';
import useLatch from '../common/useLatch';

type Props = {
  freezeScroll: boolean;
  view: View;
  occurrences: JSX.Element;
  days: JSX.Element;
  dates: JSX.Element;
  list: JSX.Element;
};

export default function Layout({
  freezeScroll,
  view,
  occurrences,
  days,
  dates,
  list,
}: Props) {
  const viewType = viewToViewType[view.name];

  let layoutClassName = 'layout';

  layoutClassName += ` ${viewType}`;
  if (freezeScroll) layoutClassName += ' frozen';

  // temp using useMemo so that this triggers before height is set to 100vh, scrollDst is always 0
  useMemo(() => {
    if (freezeScroll) {
      let scrollDistance: number;
      if (viewType === 'list') {
        scrollDistance = window.scrollY;
      } else {
        // scrollDistance = document.body.scrollHeight - window.scrollY - window.innerHeight;
        scrollDistance = window.scrollY;
      }

      document.documentElement.style.setProperty('--scroll-distance', `${scrollDistance}px`);
    }
  }, [freezeScroll]);

  useEffect(() => {
    if (!freezeScroll) {
      const lastScrollDistance = parseInt(
        document.documentElement.style.getPropertyValue('--scroll-distance'),
        10,
      );
      window.scrollTo(0, lastScrollDistance);
    }
  }, [freezeScroll]);

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
          height: '1px',
          top: 'calc(50vh - 26px)',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: '1px',
          top: 'calc(50vh + 24px)',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: 'var(--layout-vertical-margin)',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: 'var(--layout-vertical-margin)',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        className={layoutClassName}
      >
        <div className="layout-scroll">
          <div className="layout-occurrences" />
          {/* <div className="layout-days">{days}</div> */}
          <div className="layout-dates" />
          <div className="layout-list" />
        </div>
      </div>
    </>
  );
}
