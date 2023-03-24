import React, {
  useEffect,
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
  const [frozen, setFrozen] = useState(freezeScroll);

  const firstRender = React.useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--list-height', `${listHeight}px`);
  }, [listHeight]);

  useEffect(() => {
    document.documentElement.style.setProperty('--occurrence-height', `${occurrenceHeight}px`);
  }, [occurrenceHeight]);

  useEffect(() => {
    if (frozen) return; // don't allow view change when frozen
    const nextViewType = viewToViewType[view.name];
    setDisplayedViewType(nextViewType);
    if (displayedViewType !== nextViewType) {
      if (displayedViewType === 'list') {
        document.documentElement.style.setProperty('--transition-scroll-distance', `${window.scrollY}px`);
      } else {
        const distanceFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
        document.documentElement.style.setProperty('--transition-scroll-distance', `${distanceFromBottom}px`);
      }
      onTransition(setInTransition);
    }
  }, [view, displayedViewType, frozen, setInTransition]);

  useEffect(() => {
    setFrozen(freezeScroll);
    if (freezeScroll) {
      document.documentElement.style.setProperty('--freeze-scroll-distance', `${window.scrollY}px`);
    }
  }, [freezeScroll]);

  useEffect(() => {
    if (!frozen) {
      const lastScrollDistance = document.documentElement.style.getPropertyValue('--freeze-scroll-distance');
      document.documentElement.style.removeProperty('--freeze-scroll-distance');
      window.scrollTo(0, parseInt(lastScrollDistance, 10));
    }
  }, [frozen]);

  let layoutClassName = 'layout';

  useEffect(() => {
    if (displayedViewType === 'occurrence') {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      window.scrollTo(0, 0);
    }
  }, [displayedViewType]);

  layoutClassName += ` ${displayedViewType}`;
  if (frozen) layoutClassName += ' frozen';
  if (firstRender.current) layoutClassName += ' first-render';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          height: '1px',
          top: 'calc(50vh - 26px)',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: '1px',
          top: 'calc(50vh + 24px)',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: 'var(--layout-vertical-margin)',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          height: 'var(--layout-vertical-margin)',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 255, 0.5)',
        }}
      />
      <div className={layoutClassName}>
        <div className="layout-freeze">
          <div className="layout-scroll">
            <div className="layout-occurrences">
              <div>{occurrences}</div>
              <div style={{ position: 'absolute', bottom: 0 }}>{days}</div>
            </div>
            <div className="layout-dates">{dates}</div>
            <div className="layout-list">{list}</div>
          </div>
        </div>
      </div>
    </>
  );
}
