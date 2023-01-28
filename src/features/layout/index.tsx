/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import { View } from '../../globalTypes';
import Indicators from './indicators';
import './layout.css';

type LayoutOptions = {
  minMarginHeight: number;
  maxListHeight: number;
};

type Props = {
  options: LayoutOptions;
  view: View;
  listRows: number;
  occurrenceRows: number;
};

type ViewType = 'occurrence' | 'list';

// trigger reflow - https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
function forceElementReflow(element: HTMLElement) {
  /* eslint-disable no-param-reassign */
  element.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-expressions
  element.style.transition = '';
  /* eslint-enable no-param-reassign */
}

function setScreenHeightAndMargin(
  options: LayoutOptions,
  viewType: ViewType,
  listRows: number,
  occurrenceRows: number,
) {
  const windowHeight = window.innerHeight;
  const { minMarginHeight, maxListHeight } = options;

  if (viewType === 'list') {
    // + 100 for days and dates
    const listHeight = listRows * 50 + 100;
    const listAvailableSpace = Math.min(windowHeight - 2 * minMarginHeight, maxListHeight);
    const overflow = listHeight - listAvailableSpace;

    const marginHeight = (windowHeight - listAvailableSpace) / 2;
    const screenHeight = overflow > 0
      ? windowHeight + overflow
      : windowHeight;

    if (occurrenceRows * 50 - 50 > marginHeight) {
      const screenOffset = occurrenceRows * 50 - 50 - marginHeight;
      document.documentElement.style.setProperty('--screen-offset', `${screenOffset}px`);
    } else {
      document.documentElement.style.setProperty('--screen-offset', '0px');
    }

    document.documentElement.style.setProperty('--screen-height', `${screenHeight}px`);
    document.documentElement.style.setProperty('--last-list-margin-height', `${marginHeight}px`);
    document.documentElement.style.setProperty('--margin-height', `${marginHeight}px`);
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

    document.documentElement.style.setProperty('--screen-offset', '0px');
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
  scrollDistance: number,
  layoutContainer: HTMLDivElement,
  elements: { [key in 'occurrences' | 'days' | 'dates' | 'list']: HTMLDivElement },
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setInTransition(true);

  layoutContainer.classList.remove(`${from}-view`);
  layoutContainer.classList.add(`${to}-view`);

  if (to === 'occurrence') {
    window.scrollTo({
      top: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    });
  } else {
    // const prevOffset = document.documentElement.style.getPropertyValue('--list-offset');
    // const offsetValue = prevOffset === ''
    //   ? 0
    //   : -Number(prevOffset.slice(0, prevOffset.length - 2));
    window.scrollTo({ top: 0 });
  }

  if (to === 'occurrence') {
    document.documentElement.style.setProperty('--list-offset', `${-scrollDistance}px`);
  }

  Object.values(elements).forEach((element) => {
    document.documentElement.style.setProperty(
      '--transition-offset',
      to === 'list'
        ? `calc(50vh - var(--last-list-margin-height) - 50px - 25px + ${scrollDistance}px)`
        : 'calc(-1 * (50vh - var(--last-list-margin-height) - 50px - 25px))',
    );
    forceElementReflow(element);
    document.documentElement.style.setProperty('--transition-offset', '');

    // eslint-disable-next-line no-param-reassign
    element.style.transition = `top ${duration}ms`;
    if (element === elements.occurrences) {
      // eslint-disable-next-line no-param-reassign
      element.style.transition = `top ${duration}ms, height ${duration}ms`;
    }

    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      element.style.transition = '';
      setInTransition(false);
    }, duration);
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
  const layoutContainer = useRef<HTMLDivElement>(null);
  const lastView = useRef<View['name']>('today');

  useEffect(() => {
    document.documentElement.style.setProperty('--list-row-count', listRows.toString());
  }, [listRows]);

  useEffect(() => {
    document.documentElement.style.setProperty('--occurrence-row-count', occurrenceRows.toString());
  }, [occurrenceRows]);

  useEffect(() => {
    const setVariables = () => setScreenHeightAndMargin(
      options,
      viewTypes[view.name],
      listRows,
      occurrenceRows,
    );

    if (viewTypes[view.name] !== viewTypes[lastView.current]) {
      const scrollDistance = viewTypes[lastView.current] === 'list'
        ? document.documentElement.scrollTop
        : document.documentElement.scrollHeight - document.documentElement.clientHeight - document.documentElement.scrollTop;

      setVariables();

      transition(
        viewTypes[lastView.current],
        viewTypes[view.name],
        750,
        scrollDistance,
        layoutContainer.current,
        {
          occurrences: occurrences.current,
          days: days.current,
          dates: dates.current,
          list: list.current,
        },
        () => {},
      );
    } else {
      setVariables();
    }

    if (view.name !== lastView.current) {
      lastView.current = view.name;
    }

    window.addEventListener('resize', setVariables);
    return () => window.removeEventListener('resize', setVariables);
  }, [listRows, occurrenceRows, options, view]);

  useEffect(() => {

  }, [view]);

  return (
    <>
      <Indicators options={options} />
      <div
        ref={layoutContainer}
        className="layout-container list-view"
      >
        <div
          className="layout-overflow"
        >
          <div
            className="sticky-group"
          >
            <div
              ref={occurrences}
              className="occurrences"
            />
            <div
              ref={days}
              className="days"
            />
            <div
              ref={dates}
              className="dates"
            />
          </div>
          <div
            ref={list}
            className="list"
          />
        </div>
      </div>
    </>
  );
}
