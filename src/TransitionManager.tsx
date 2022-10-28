import React, { useEffect, useState } from 'react';
import './transitionManager.css';

function forceElementReflow(element: HTMLElement, className: string) {
  /* eslint-disable no-param-reassign */
  element.style.transition = 'none';
  element.classList.add(className);
  // trigger reflow - https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
  element.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-expressions
  element.style.transition = '';
  // once reflow has been triggered and element possesses styling, it can be cleaned up
  element.classList.remove(className);
  /* eslint-enable no-param-reassign */
}

const getListMargin = (listHeightInPx: number) => `max(
  var(--min-margin-height),
  50vh - (${listHeightInPx}px + 100px) / 2
)`;

const getOccurrenceMargin = (occurrenceHeightInPx: number) => `max(
  var(--min-margin-height),
  50vh - (${occurrenceHeightInPx}px + 50px) / 2
)`;

const viewTypes = {
  habit: 'list',
  selection: 'list',
  history: 'occurrence',
  focus: 'occurrence',
};

type View = 'habit' | 'selection' | 'history' | 'focus';

function getDocumentBottom() {
  const { scrollHeight, clientHeight } = document.documentElement;
  return scrollHeight - clientHeight;
}

function transition(
  oldView: View,
  newView: View,
  newBodyHeight: number,
  setInTransition: Function,
) {
  // need to calculate scroll offset before changing the old-margin
  // and new-margin properties as they change the document height
  const { scrollTop } = document.documentElement;
  let documentBottom = getDocumentBottom();
  const scrollDstFromBottom = documentBottom - scrollTop;
  const scrollDstFromTop = scrollTop;

  const container = document.getElementById('container');
  const occurrences = document.getElementById('occurrences');
  const days = document.getElementById('days');
  const dates = document.getElementById('dates');
  const list = document.getElementById('list');
  const maskTop = document.getElementById('mask-top');
  const maskBottom = document.getElementById('mask-bottom');

  if (!container || !occurrences || !days || !dates || !list || !maskTop || !maskBottom) {
    throw new Error('DOM missing vital element');
  }

  const oldViewType = viewTypes[oldView];
  const newViewType = viewTypes[newView];
  const newMargin = newViewType === 'list'
    ? getListMargin(newBodyHeight)
    : getOccurrenceMargin(newBodyHeight);
  const lastMargin = document.documentElement.style.getPropertyValue('--new-margin');
  document.documentElement.style.setProperty('--old-margin', lastMargin);
  document.documentElement.style.setProperty('--new-margin', newMargin);

  if (newViewType === 'list') {
    document.documentElement.style.setProperty('--list-height', `${newBodyHeight}px`);
  } else if (newViewType === 'occurrence') {
    document.documentElement.style.setProperty('--occurrences-height', `${newBodyHeight}px`);
  }

  if (oldViewType !== newViewType) {
    if (newViewType === 'occurrence') {
      document.documentElement.style.setProperty('--scroll-offset', `${scrollDstFromTop}px`);
    }

    if (newViewType === 'list') {
      document.documentElement.style.setProperty('--scroll-offset', `${scrollDstFromBottom}px`);
    }

    if (newViewType === 'occurrence') {
      forceElementReflow(occurrences, 'occurrences-list-to-occurrence-start-point');
      forceElementReflow(days, 'days-list-to-occurrence-start-point');
      forceElementReflow(dates, 'dates-list-to-occurrence-start-point');
      forceElementReflow(list, 'list-list-to-occurrence-start-point');
      forceElementReflow(maskTop, 'mask-top-list-to-occurrence-start-point');
      forceElementReflow(maskBottom, 'mask-bottom-list-to-occurrence-start-point');

      documentBottom = getDocumentBottom();
      window.scrollTo({ top: documentBottom });
    }

    if (newViewType === 'list') {
      forceElementReflow(occurrences, 'occurrences-occurrence-to-list-start-point');
      forceElementReflow(days, 'days-occurrence-to-list-start-point');
      forceElementReflow(dates, 'dates-occurrence-to-list-start-point');
      forceElementReflow(list, 'list-occurrence-to-list-start-point');
      forceElementReflow(maskTop, 'mask-top-occurrence-to-list-start-point');
      forceElementReflow(maskBottom, 'mask-bottom-occurrence-to-list-start-point');

      window.scrollTo({ top: 0 });
    }

    container.classList.remove(`container-${oldViewType}-view`);
    occurrences.classList.remove(`occurrences-${oldViewType}-view`);
    days.classList.remove(`days-${oldViewType}-view`);
    dates.classList.remove(`dates-${oldViewType}-view`);
    list.classList.remove(`list-${oldViewType}-view`);
    maskTop.classList.remove(`mask-top-${oldViewType}-view`);
    maskBottom.classList.remove(`mask-bottom-${oldViewType}-view`);

    container.classList.add(`container-${newViewType}-view`);
    occurrences.classList.add(`occurrences-${newViewType}-view`);
    days.classList.add(`days-${newViewType}-view`);
    dates.classList.add(`dates-${newViewType}-view`);
    list.classList.add(`list-${newViewType}-view`);
    maskTop.classList.add(`mask-top-${newViewType}-view`);
    maskBottom.classList.add(`mask-bottom-${newViewType}-view`);
  }

  setTimeout(() => setInTransition(false), 750);
}

const keyboardShortcuts: { [shortcutKey: string]: View } = {
  t: 'habit',
  s: 'selection',
  h: 'history',
  f: 'focus',
};

type TransitionManagerProps = {
  dates: JSX.Element;
  days: JSX.Element;
  list: JSX.Element;
};

function TransitionManager({ dates, days, list }: TransitionManagerProps) {
  const [currentView, setCurrentView] = useState<View>('habit');
  const [inTransition, setInTransition] = useState(false);
  const [listLength] = useState(22);
  const [occurrencesLength] = useState(22);

  // temporary -- temporary -- temporary -- temporary -- temporary -- temporary -- temporary

  // this is an initializer, only needs to happen once, not after every state change

  // temporary -- temporary -- temporary -- temporary -- temporary -- temporary -- temporary
  useEffect(() => {
    document.documentElement.style.setProperty('--new-margin', getListMargin(listLength * 50));
    document.documentElement.style.setProperty('--list-height', `${listLength * 50}px`);
  }, [listLength]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (Object.prototype.hasOwnProperty.call(keyboardShortcuts, e.key)) {
        e.preventDefault();
        const newView = keyboardShortcuts[e.key];
        if (!inTransition && currentView !== newView) {
          setCurrentView(newView);
          setInTransition(true);
          const getBodyHeight = {
            habit: () => listLength * 50,
            selection: () => listLength * 50,
            history: () => occurrencesLength * 50,
            focus: () => 200,
          };
          transition(currentView, newView, getBodyHeight[newView](), setInTransition);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inTransition, currentView, listLength, occurrencesLength]);

  return (
    <div id="container" className="container container-list-view">
      <div id="mask-top" className="mask mask-top mask-top-list-view" />
      <div id="mask-bottom" className="mask mask-bottom mask-bottom-list-view" />
      <div id="occurrences" className="occurrences occurrences-list-view" />
      <div id="days" className="days days-list-view">
        {days}
      </div>
      <div id="dates" className="dates dates-list-view">
        {dates}
      </div>
      <div id="list" className="list list-list-view">
        {list}
      </div>
    </div>
  );
}

export default TransitionManager;
