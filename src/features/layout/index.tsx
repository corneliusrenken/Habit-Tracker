import React, { useEffect, useRef } from 'react';
import { View } from '../../globalTypes';
import Indicators from './indicators';
import './layout.css';

type LayoutOptions = {
  marginHeight: number;
  maxListHeight: number;
};

type Props = {
  options: LayoutOptions;
  view: View;
  listRows: number;
  occurrenceRows: number;
};

type ViewType = 'occurrence' | 'list';

function setScreenHeightAndMargin(
  options: LayoutOptions,
  viewType: ViewType,
  listRows: number,
  occurrenceRows: number,
) {
  const windowHeight = window.innerHeight;
  const { marginHeight, maxListHeight } = options;

  if (viewType === 'list') {
    // + 100 for days and dates
    const listHeight = listRows * 50 + 100;
    const listAvailableSpace = Math.min(windowHeight - 2 * marginHeight, maxListHeight);
    const overflow = listHeight - listAvailableSpace;

    const screenHeight = overflow > 0
      ? windowHeight + overflow
      : windowHeight;
    document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
    document.documentElement.style.setProperty('--margin-height', `${(windowHeight - listAvailableSpace) / 2}px`);
  }

  if (viewType === 'occurrence') {
    // + 50 for dates row
    const occurrenceHeight = occurrenceRows * 50 + 50;
    const screenMidpoint = Math.ceil(windowHeight / 2);
    // allows bottom most occurrence row to be centered on screen
    const marginBelowOccurrences = windowHeight - screenMidpoint - 25;
    const overflow = occurrenceHeight + marginBelowOccurrences - windowHeight;
    const marginAboveOccurrences = overflow > 0
      ? 0
      : windowHeight - marginBelowOccurrences - occurrenceHeight;

    const screenHeight = overflow > 0
      ? windowHeight + overflow
      : windowHeight;
    document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
    document.documentElement.style.setProperty('--margin-height', `${marginAboveOccurrences}px`);
  }
}

/**
 * @param duration in ms
 */
function transition(
  from: ViewType,
  to: ViewType,
  duration: number,
  elements: { [key in 'occurrences' | 'days' | 'dates' | 'list']: HTMLDivElement },
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (from === to) return;

  setInTransition(true);

  // let finishedTransitionCount = 0;

  Object.values(elements).forEach((element) => {
    // finishedTransitionCount += 1;
    element.classList.remove(`${from}-view`);
    element.classList.add(`${to}-view`);

    if (to === 'occurrence') {
      window.scrollTo({
        top: 5000,
        // top: Number(document.documentElement.style.getPropertyValue('--screen-height')),
      });
    } else {
      window.scrollTo({ top: 0 });
    }

    // // eslint-disable-next-line no-param-reassign
    // element.style.transition = `opacity ${duration}ms, top ${duration} ms`;

    // const onTransitionEnd = (e: TransitionEvent) => {
    //   if (e.propertyName !== 'top') return;
    //   // eslint-disable-next-line no-param-reassign
    //   element.style.transition = '';

    //   finishedTransitionCount -= 1;
    //   if (finishedTransitionCount === 0) {
    //     setInTransition(false);
    //   }

    //   element.removeEventListener('transitionend', onTransitionEnd);
    // };

    // element.addEventListener('transitionend', onTransitionEnd);
  });
}

const viewTypes: { [key in View['name']]: ViewType } = {
  today: 'list',
  yesterday: 'list',
  selection: 'list',
  history: 'occurrence',
  focus: 'occurrence',
};

export default function Layout({
  options, view, listRows, occurrenceRows,
}: Props) {
  const occurrences = useRef<HTMLDivElement>(null);
  const days = useRef<HTMLDivElement>(null);
  const dates = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const lastView = useRef<View['name']>('today');

  useEffect(() => {
    document.documentElement.style.setProperty('--list-row-count', listRows.toString());
  }, [listRows]);

  useEffect(() => {
    document.documentElement.style.setProperty('--occurrence-row-count', occurrenceRows.toString());
  }, [occurrenceRows]);

  useEffect(() => {
    const onResize = () => setScreenHeightAndMargin(
      options,
      viewTypes[view.name],
      listRows,
      occurrenceRows,
    );

    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [listRows, occurrenceRows, options, view]);

  useEffect(() => {
    if (view.name === lastView.current) return;

    if (viewTypes[view.name] !== viewTypes[lastView.current]) {
      transition(
        viewTypes[lastView.current],
        viewTypes[view.name],
        750,
        {
          occurrences: occurrences.current,
          days: days.current,
          dates: dates.current,
          list: list.current,
        },
        () => {},
      );
    }

    lastView.current = view.name;
  }, [view]);

  return (
    <>
      <Indicators options={options} />
      <div
        className="layout-container"
      >
        <div
          ref={occurrences}
          className="occurrences list-view"
        />
        <div
          ref={days}
          className="days list-view"
        />
        <div
          ref={dates}
          className="dates list-view"
        />
        <div
          ref={list}
          className="list list-view"
        />
      </div>
    </>
  );
}
