import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, viewToViewType, ViewType } from '../../globalTypes';
import useLatch from '../common/useLatch';
import Icon from '../icon';
import getScreenPercentage from './getScreenPercentage';
import triggerElementReflow from './triggerElementReflow';

type Props = {
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

export default function Layout({
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
  const [scrollable, setScrollable] = useState(() => getScreenPercentage() < 100);

  const layoutRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const initialRender = React.useRef(true); // used to disable css animations until view type change

  useEffect(() => {
    const onScroll = () => {
      setScrollPos(window.scrollY);
    };

    onScroll();

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [listHeight, displayedView]); // only needed in list view so no occurrenceHeight dependency

  useEffect(() => {
    function onZoomOrResize() {
      setScrollable(getScreenPercentage() < 100);
      setScrollPos(window.scrollY);
    }

    onZoomOrResize();

    window.addEventListener('zoom', onZoomOrResize);
    window.addEventListener('resize', onZoomOrResize);
    return () => {
      window.removeEventListener('zoom', onZoomOrResize);
      window.removeEventListener('resize', onZoomOrResize);
    };
  }, [listHeight, occurrenceHeight, displayedView]);

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

  useMemo(() => {
    if (freezeScroll) {
      document.documentElement.style.setProperty('--freeze-scroll-distance', `${window.scrollY}px`);
    }
  }, [freezeScroll]);

  useEffect(() => {
    if (!freezeScroll) {
      const lastScrollDistance = document.documentElement.style.getPropertyValue('--freeze-scroll-distance');
      document.documentElement.style.removeProperty('--freeze-scroll-distance');
      window.scrollTo(0, parseInt(lastScrollDistance, 10));
    }
  }, [freezeScroll]);

  let layoutClassName = 'layout';

  layoutClassName += ` ${viewToViewType[displayedView.name]}`;
  if (freezeScroll) layoutClassName += ' frozen';
  if (initialRender.current) layoutClassName += ' initial-render';

  const upperMaskAppearancePercentage = useLatch<number>(
    Math.min(1, scrollPos / 25),
    useCallback((lastPercentage) => {
      if (freezeScroll) return lastPercentage;
      return Math.min(1, scrollPos / 25);
    }, [scrollPos, freezeScroll]),
  );

  const scrolledToEndOfDocument = scrollPos === document.body.scrollHeight - window.innerHeight;

  return (
    <>
      <div ref={layoutRef} className={layoutClassName}>
        <div className="layout-freeze">
          <div className="layout-scroll" ref={scrollRef}>
            <div className="layout-occurrences-and-days">
              <div className="layout-occurrences" style={{ position: 'absolute', bottom: 0 }}>{occurrences}</div>
              <div className="layout-days" style={{ position: 'absolute', bottom: 0 }}>{days}</div>
              <div
                className="layout-mask"
                style={{
                  height: `calc(var(--layout-vertical-margin, 0px) + 100px + ${25 * upperMaskAppearancePercentage}px)`,
                  bottom: `-${50 + 25 * upperMaskAppearancePercentage}px`,
                  WebkitMaskImage: `linear-gradient(to bottom, black ${100 - 10 * upperMaskAppearancePercentage}%, transparent)`,
                }}
              />
              <div
                className="layout-mask"
                style={{
                  height: 'var(--layout-vertical-margin, 0px)',
                  bottom: 'calc(50px + var(--layout-vertical-margin, 0px) - 100vh)',
                  WebkitMaskImage: 'linear-gradient(to top, black 90%, transparent)',
                }}
              />
              <div
                className="layout-scroll-indicator"
                style={{
                  opacity: scrollPos !== 0 && viewToViewType[displayedView.name] === 'list' && scrollable ? 1 : 0,
                  bottom: '-50px',
                }}
              >
                <Icon icon="double arrow up" />
              </div>
              <div
                className="layout-scroll-indicator"
                style={{
                  opacity: !scrolledToEndOfDocument && viewToViewType[displayedView.name] === 'list' && scrollable ? 1 : 0,
                  bottom: 'calc(50px + 2 * var(--layout-vertical-margin, 0px) - 100vh)',
                }}
              >
                <Icon icon="double arrow down" />
              </div>
            </div>
            <div className="layout-dates">{dates}</div>
            <div className="layout-list">{list}</div>
          </div>
        </div>
      </div>
      <div className="layout-settings-button">
        {settingsButton}
      </div>
    </>
  );
}
