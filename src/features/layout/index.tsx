import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, viewToViewType, ViewType } from '../../globalTypes';
import useLatch from '../common/useLatch';
import Scrollbar from '../scrollbar';

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

function onTransition(setInTransition: React.Dispatch<React.SetStateAction<boolean>>) {
  setInTransition(true);

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
  const [displayedViewType, setDisplayedViewType] = useState<ViewType>(viewToViewType[view.name]);
  const [scrollHeight, setScrollHeight] = useState(0);

  const initialRender = React.useRef(true);

  useEffect(() => {
    const onScroll = () => {
      setScrollHeight(window.scrollY);
    };

    onScroll();

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [listHeight, occurrenceHeight, displayedViewType]);

  useEffect(() => {
    const nextViewType = viewToViewType[view.name];
    setDisplayedViewType(nextViewType);
    if (displayedViewType !== nextViewType) {
      initialRender.current = false;
      if (displayedViewType === 'list') {
        document.documentElement.style.setProperty('--transition-scroll-distance', `${window.scrollY}px`);
      } else {
        const distanceFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
        document.documentElement.style.setProperty('--transition-scroll-distance', `${distanceFromBottom}px`);
      }
      onTransition(setInTransition);
    } else if (displayedViewType === 'list') {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [view, displayedViewType, setInTransition]);

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

  useEffect(() => {
    if (displayedViewType === 'occurrence') {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      window.scrollTo(0, 0);
    }
  }, [displayedViewType]);

  layoutClassName += ` ${displayedViewType}`;
  if (freezeScroll) layoutClassName += ' frozen';
  if (initialRender.current) layoutClassName += ' initial-render';

  const upperMaskAppearancePercentage = useLatch<number>(
    Math.min(1, scrollHeight / 25),
    useCallback((lastPercentage) => {
      if (freezeScroll) return lastPercentage;
      return Math.min(1, scrollHeight / 25);
    }, [scrollHeight, freezeScroll]),
  );

  return (
    <>
      <div
        className={layoutClassName}
        style={{
          '--list-height': `${listHeight}px`,
          '--occurrence-height': `max(50vh - 25px, ${occurrenceHeight}px)`,
        } as React.CSSProperties}
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
          viewType={displayedViewType}
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
