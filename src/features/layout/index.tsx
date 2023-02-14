/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import { View, viewToViewType } from '../../globalTypes';
import Scrollbar from '../scrollbar';
import getScrollDistance from './getScrollDistance';
import setLayoutCSSProperties from './setLayoutCSSProperties';
import transition from './transition';
import { LayoutOptions } from './types';

type Props = {
  layoutOptions: LayoutOptions;
  view: View;
  listRows: number;
  occurrenceRows: number;
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>;
  occurrences: JSX.Element;
  dates: JSX.Element;
  days: JSX.Element;
  list: JSX.Element;
};

export default function Layout({
  layoutOptions,
  view,
  listRows,
  occurrenceRows,
  setInTransition,
  occurrences,
  dates,
  days,
  list,
}: Props) {
  const layoutRef = useRef<HTMLDivElement>(null);
  const lastView = useRef<View['name']>('today');
  const [screenHeight, setScreenHeight] = React.useState(() => Number(document.documentElement.style.getPropertyValue('--screen-height').slice(0, -2)));

  useEffect(() => {
    document.documentElement.style.setProperty('--list-row-count', listRows.toString());
  }, [listRows]);

  useEffect(() => {
    document.documentElement.style.setProperty('--occurrence-row-count', occurrenceRows.toString());
  }, [occurrenceRows]);

  useEffect(() => {
    if (layoutRef.current === null) return;

    if (viewToViewType[view.name] !== viewToViewType[lastView.current]) {
      const scrollDistance = getScrollDistance();

      setLayoutCSSProperties(
        layoutOptions,
        viewToViewType[view.name],
        listRows,
        occurrenceRows,
        setScreenHeight,
      );

      transition({
        from: viewToViewType[lastView.current],
        to: viewToViewType[view.name],
        currentScrollPosition: viewToViewType[view.name] === 'occurrence'
          ? scrollDistance.fromTop
          : scrollDistance.fromBottom,
        layout: layoutRef.current,
        setInTransition,
      });
    } else {
      setLayoutCSSProperties(
        layoutOptions,
        viewToViewType[view.name],
        listRows,
        occurrenceRows,
        setScreenHeight,
      );

      if (view.name !== lastView.current) {
        if (viewToViewType[view.name] === 'list') {
          window.scrollTo({ top: 0 });
        } else {
          window.scrollTo({ top: document.body.scrollHeight });
        }
      }
    }

    if (view.name !== lastView.current) {
      lastView.current = view.name;
    }

    const onResize = () => setLayoutCSSProperties(
      layoutOptions,
      viewToViewType[view.name],
      listRows,
      occurrenceRows,
      setScreenHeight,
    );

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize); // eslint-disable-line consistent-return
  }, [layoutOptions, listRows, occurrenceRows, setInTransition, view]);

  return (
    <div
      ref={layoutRef}
      className="layout list-view"
    >
      <div
        className="layout-overflow"
      >
        <div
          className="layout-sticky-group"
        >
          <div
            className="layout-scrollbar"
          >
            <Scrollbar
              view={view}
              screenHeight={screenHeight}
            />
          </div>
          <div
            className="layout-occurrences"
          >
            {occurrences}
          </div>
          <div
            className="layout-days"
          >
            {days}
          </div>
          <div
            className="layout-dates"
          >
            {dates}
          </div>
        </div>
        <div
          className="layout-list"
        >
          {list}
        </div>
        <div className="layout-bottom-mask" />
      </div>
    </div>
  );
}
