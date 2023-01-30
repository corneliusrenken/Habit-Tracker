/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import { View, viewToViewType } from '../../globalTypes';
import getScrollDistance from './getScrollDistance';
import './layout.css';
import setLayoutCSSProperties from './setLayoutCSSProperties';
import transition from './transition';
import { LayoutOptions } from './types';

type Props = {
  layoutOptions: LayoutOptions;
  view: View;
  listRows: number;
  occurrenceRows: number;
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>,
};

export default function Layout({
  layoutOptions, view, listRows, occurrenceRows, setInTransition,
}: Props) {
  const stickyGroup = useRef<HTMLDivElement>(null);
  const bottomMask = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
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
        duration: 600,
        currentScrollPosition: viewToViewType[view.name] === 'occurrence'
          ? scrollDistance.fromTop
          : scrollDistance.fromBottom,
        transitionElements: {
          stickyGroup: stickyGroup.current,
          list: list.current,
          bottomMask: bottomMask.current,
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
  }, [listRows, occurrenceRows, layoutOptions, view, setInTransition]);

  return (
    <div
      className="layout-container"
    >
      <div
        className="layout-overflow"
      >
        <div
          ref={stickyGroup}
          className="sticky-group list-view"
        >
          <div
            className="occurrences"
          />
          <div
            className="days"
          />
          <div
            className="dates"
          />
        </div>
        <div
          ref={list}
          className="list list-view"
        />
        <div className="top-mask list-view" />
        <div ref={bottomMask} className="bottom-mask list-view" />
      </div>
    </div>
  );
}
