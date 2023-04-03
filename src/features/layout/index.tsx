import React, {
  useEffect,
  useState,
} from 'react';
import { View, viewToViewType, ViewType } from '../../globalTypes';
import Icon from '../icon';
import Masks from './Masks';
import triggerElementReflow from './triggerElementReflow';

type States = {
  layoutElement: HTMLDivElement;
  scrollElement: HTMLDivElement;
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>;
};

function transition(
  displayedViewType: ViewType,
  nextViewType: ViewType,
  scrollDistance: { fromTop: number; fromBottom: number },
  { layoutElement, scrollElement, setInTransition }: States,
) {
  setInTransition(true);

  // have to remove and add the classes manually before the next render for the element reflow
  layoutElement.classList.remove('initial-render');
  layoutElement.classList.remove(displayedViewType);
  layoutElement.classList.add(nextViewType);
  document.documentElement.style.setProperty('--transition-scroll-distance', `${displayedViewType === 'list' ? scrollDistance.fromTop : scrollDistance.fromBottom}px`);

  triggerElementReflow(layoutElement);

  window.scrollTo({
    top: nextViewType === 'list' ? 0 : document.body.scrollHeight,
  });

  const onAnimationEnd = (e: AnimationEvent) => {
    if (e.target !== scrollElement) return;
    setInTransition(false);
    document.documentElement.style.removeProperty('--transition-scroll-distance');
    document.documentElement.removeEventListener('animationend', onAnimationEnd);
  };

  document.documentElement.addEventListener('animationend', onAnimationEnd);
}

function checkToDisplayScrollIndicator() {
  const scrollable = document.documentElement.scrollHeight > window.innerHeight;
  const scrolledToBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight;
  return scrollable && !scrolledToBottom;
}

type Props = {
  launchAnimationActive: boolean;
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>;
  freezeScroll: boolean;
  view: View;
  listHeight: number;
  occurrenceHeight: number;
  occurrences: JSX.Element;
  days: JSX.Element;
  dates: JSX.Element;
  list: JSX.Element;
  settingsButton: JSX.Element;
};

export default function Layout({
  launchAnimationActive,
  setInTransition,
  freezeScroll,
  view,
  listHeight,
  occurrenceHeight,
  occurrences,
  days,
  dates,
  list,
  settingsButton,
}: Props) {
  const [displayedView, setDisplayedView] = useState<View>(view);
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const [displayScrollIndicator, setDisplayScrollIndicator] = useState(() => (
    checkToDisplayScrollIndicator()
  ));

  const layoutRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const initialRender = React.useRef(true); // used to disable css animations until view type change

  // handle view transitions
  useEffect(() => {
    const nextView = view;

    const scrollDistanceFromTop = window.scrollY;
    const scrollDistanceFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight; // eslint-disable-line max-len

    document.documentElement.style.setProperty('--list-height', `${listHeight}px`);
    document.documentElement.style.setProperty('--occurrence-height', `max(50vh - 25px, ${occurrenceHeight}px)`);

    if (
      (nextView.name === 'focus' && displayedView.name === 'focus' && nextView.focusId === displayedView.focusId)
      || (nextView.name === displayedView.name)
    ) return; // if no change in view, do nothing

    const displayedViewType = viewToViewType[displayedView.name];
    const nextViewType = viewToViewType[view.name];

    if (displayedViewType !== nextViewType) {
      if (!layoutRef.current || !scrollRef.current) throw new Error('Can\'t transition with refs not set');

      initialRender.current = false;

      transition(
        displayedViewType,
        nextViewType,
        { fromTop: scrollDistanceFromTop, fromBottom: scrollDistanceFromBottom },
        { layoutElement: layoutRef.current, scrollElement: scrollRef.current, setInTransition },
      );
    } else if (displayedViewType === 'list') {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: document.body.scrollHeight });
    }

    setDisplayedView(nextView);
  }, [view, setInTransition, listHeight, occurrenceHeight, displayedView]);

  // scroll to scrollPos that existed previous to freezing scroll
  useEffect(() => {
    if (!freezeScroll) {
      window.scrollTo(0, scrollPos);
    }
  }, [freezeScroll, scrollPos]);

  // update scrollPos and displayScrollIndicator on resize, zoom, and scroll, unless frozen
  // needs to happen after transition
  useEffect(() => {
    const onResizeZoomScroll = () => {
      if (freezeScroll) return;
      setScrollPos(window.scrollY);
      setDisplayScrollIndicator(checkToDisplayScrollIndicator());
    };

    onResizeZoomScroll();

    window.addEventListener('resize', onResizeZoomScroll);
    window.addEventListener('zoom', onResizeZoomScroll);
    window.addEventListener('scroll', onResizeZoomScroll);
    return () => {
      window.removeEventListener('resize', onResizeZoomScroll);
      window.removeEventListener('zoom', onResizeZoomScroll);
      window.removeEventListener('scroll', onResizeZoomScroll);
    };
  }, [freezeScroll, listHeight, occurrenceHeight]);

  let layoutClassName = 'layout';
  layoutClassName += ` ${viewToViewType[displayedView.name]}`;
  if (freezeScroll) layoutClassName += ' frozen';
  if (initialRender.current) layoutClassName += ' initial-render';
  if (launchAnimationActive) layoutClassName += ' launch-animation';

  let scrollIndicatorClassName = 'layout-scroll-indicator';
  if (!displayScrollIndicator) scrollIndicatorClassName += ' hidden';

  return (
    <>
      <div
        ref={layoutRef}
        className={layoutClassName}
        style={{
          '--freeze-scroll-distance': `${scrollPos}px`,
        } as React.CSSProperties}
      >
        <div className="layout-freeze">
          <div className="layout-scroll" ref={scrollRef}>
            <div className="layout-occurrences-and-days">
              <div className="layout-occurrences" style={{ position: 'absolute', bottom: 0 }}>{occurrences}</div>
              <div className="layout-days" style={{ position: 'absolute', bottom: 0 }}>{days}</div>
              <Masks scrollPos={scrollPos} />
              <div className={scrollIndicatorClassName}><Icon icon="chevron down" /></div>
            </div>
            <div className="layout-dates">{dates}</div>
            <div className="layout-list">{list}</div>
          </div>
        </div>
      </div>
      <div className={`layout-settings-button${launchAnimationActive ? ' hidden' : ''}`}>
        {settingsButton}
      </div>
    </>
  );
}
