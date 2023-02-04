/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import { View, viewToViewType } from '../../globalTypes';
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
  const stickyGroupRef = useRef<HTMLDivElement>(null);
  const bottomMaskRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastView = useRef<View['name']>('today');

  useEffect(() => {
    document.documentElement.style.setProperty('--list-row-count', listRows.toString());
  }, [listRows]);

  useEffect(() => {
    document.documentElement.style.setProperty('--occurrence-row-count', occurrenceRows.toString());
  }, [occurrenceRows]);

  useEffect(() => {
    if (viewToViewType[view.name] !== viewToViewType[lastView.current]) {
      const scrollDistance = getScrollDistance();

      setLayoutCSSProperties(
        layoutOptions,
        viewToViewType[view.name],
        listRows,
        occurrenceRows,
      );

      transition({
        from: viewToViewType[lastView.current],
        to: viewToViewType[view.name],
        currentScrollPosition: viewToViewType[view.name] === 'occurrence'
          ? scrollDistance.fromTop
          : scrollDistance.fromBottom,
        layout: layoutRef.current,
        transitionElements: {
          stickyGroup: stickyGroupRef.current,
          list: listRef.current,
          bottomMask: bottomMaskRef.current,
        },
        setInTransition,
      });
    } else {
      setLayoutCSSProperties(
        layoutOptions,
        viewToViewType[view.name],
        listRows,
        occurrenceRows,
      );

      if (view.name !== lastView.current) {
        if (viewToViewType[view.name] === 'list') {
          window.scrollTo({ top: 0 });
        } else {
          const screenHeight = Number(
            document.documentElement.style.getPropertyValue('--screen-height').slice(0, -2),
          );
          window.scrollTo({ top: screenHeight });
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
    );

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
          ref={stickyGroupRef}
          className="layout-sticky-group"
        >
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
          ref={listRef}
          className="layout-list"
        >
          {list}
        </div>
        <div ref={bottomMaskRef} className="layout-bottom-mask" />
      </div>
    </div>
  );
}
