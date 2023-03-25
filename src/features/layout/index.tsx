import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, viewToViewType, ViewType } from '../../globalTypes';

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
}: Props) {
  const [displayedViewType, setDisplayedViewType] = useState<ViewType>(viewToViewType[view.name]);

  const initialRender = React.useRef(true);

  useEffect(() => {
    document.documentElement.style.setProperty('--list-height', `${listHeight}px`);
  }, [listHeight]);

  useEffect(() => {
    document.documentElement.style.setProperty('--occurrence-height', `max(50vh - 25px, ${occurrenceHeight}px)`);
  }, [occurrenceHeight]);

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

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 'var(--layout-vertical-margin, 0px)',
        left: 0,
        right: 0,
        backgroundColor: 'black',
        zIndex: 1000,
        height: '1px',
      }}/>
      <div style={{
        position: 'fixed',
        top: 'calc(50vh - 25px)',
        left: 0,
        right: 0,
        backgroundColor: 'cyan',
        zIndex: 1000,
        height: '50px',
        opacity: 0.2,
      }}/>
      <div className={layoutClassName}>
        <div className="layout-freeze">
          <div className="layout-scroll">
            <div className="layout-occurrences-and-days">
              <div className="layout-occurrences" style={{ position: 'absolute', bottom: 0 }}>{occurrences}</div>
              <div className="layout-days" style={{ position: 'absolute', bottom: 0 }}>{days}</div>
              <div
                className="layout-mask"
                style={{
                  height: 'var(--layout-vertical-margin, 0px)',
                  bottom: 'calc(50px + var(--layout-vertical-margin, 0px) - 100vh)',
                }}
              />
              <div
                className="layout-mask"
                style={{
                  height: 'calc(var(--layout-vertical-margin, 0px) + 100px)',
                  bottom: '-50px',
                }}
              />
            </div>
            <div className="layout-dates">{dates}</div>
            <div className="layout-list">{list}</div>
          </div>
        </div>
      </div>
    </>
  );
}
