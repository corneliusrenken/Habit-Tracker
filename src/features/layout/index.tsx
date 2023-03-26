import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, viewToViewType, ViewType } from '../../globalTypes';
import useLatch from '../common/useLatch';
import Scrollbar from '../scrollbar';
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
  setInTransition: React.Dispatch<React.SetStateAction<boolean>>;
};

function transition(
  displayedViewType: ViewType,
  nextViewType: ViewType,
  scrollDistance: { fromTop: number; fromBottom: number },
  { layoutElement, setInTransition }: States,
) {
  setInTransition(true);

  layoutElement.classList.remove(displayedViewType);
  layoutElement.classList.add(nextViewType);

  document.documentElement.style.setProperty('--transition-scroll-distance', `${displayedViewType === 'list' ? scrollDistance.fromTop : scrollDistance.fromBottom}px`);

  triggerElementReflow(layoutElement);

  window.scrollTo({
    top: nextViewType === 'list' ? 0 : document.body.scrollHeight,
  });

  const onAnimationEnd = () => {
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
  const [scrollPos, setScrollPos] = useState(0);

  const layoutRef = React.useRef<HTMLDivElement>(null);
  const initialRender = React.useRef(true);

  useEffect(() => {
    const onScroll = () => {
      setScrollPos(window.scrollY);
    };

    onScroll();

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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

    initialRender.current = false;

    const displayedViewType = viewToViewType[displayedView.name];
    const nextViewType = viewToViewType[view.name];

    if (displayedViewType !== nextViewType) {
      if (!layoutRef.current) throw new Error('Can\'t transition as layout ref is not set');

      transition(
        displayedViewType,
        nextViewType,
        { fromTop: scrollDistanceFromTop, fromBottom: scrollDistanceFromBottom },
        { layoutElement: layoutRef.current, setInTransition },
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

  return (
    <>
      <div
        ref={layoutRef}
        className={layoutClassName}
      >
        <div className="layout-freeze">
          <div className="layout-scroll">
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
            </div>
            <div className="layout-dates">{dates}</div>
            <div className="layout-list">{list}</div>
          </div>
        </div>
      </div>
      <div className="layout-scrollbar">
        <Scrollbar
          viewType={viewToViewType[displayedView.name]}
          listHeight={listHeight}
          occurrenceHeight={occurrenceHeight}
          freeze={freezeScroll}
        />
      </div>
      <div className="layout-settings-button">
        {settingsButton}
      </div>
    </>
  );
}
