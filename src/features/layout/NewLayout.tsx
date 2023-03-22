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

const verticalMargin = '200px';

export default function Layout({
  freezeScroll,
  view,
  occurrences,
  days,
  dates,
  list,
}: Props) {
  const firstRender = useRef(true);

  const viewType = viewToViewType[view.name];

  useLatch<ViewType>('list', useCallback(
    (oldViewType) => {
      if (oldViewType !== viewType) {
        firstRender.current = false;
        return viewType;
      }
      return oldViewType;
    },
    [viewType],
  ));

  useEffect(() => {
    document.documentElement.style.setProperty('--layout-vertical-margin', verticalMargin);
  }, []);

  let layoutClassName = 'layout';

  layoutClassName += ` ${viewType}`;
  if (freezeScroll) layoutClassName += ' frozen';
  if (firstRender.current) layoutClassName += ' first-render';

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

      document.documentElement.style.setProperty('--layout-scroll-distance', `${scrollDistance}px`);
    }
  }, [freezeScroll]);

  useEffect(() => {
    if (!freezeScroll) {
      const lastScrollDistance = parseInt(
        document.documentElement.style.getPropertyValue('--layout-scroll-distance'),
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
      <div
        className={layoutClassName}
      >
        <div className="layout-occurrences">{occurrences}</div>
        <div className="layout-days">{days}</div>
        <div className="layout-dates">{dates}</div>
        <div className="layout-list">{list}</div>
      </div>
    </>
  );
}
