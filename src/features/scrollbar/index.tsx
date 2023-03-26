import React, { useEffect, useState } from 'react';
import { ViewType } from '../../globalTypes';
import getScreenPercentage from './getScreenPercentage';
import getScrollPercentage from './getScrollPercentage';

type Props = {
  viewType: ViewType;
  listHeight: number;
  occurrenceHeight: number;
  freeze: boolean;
};

export default function Scrollbar({
  viewType,
  listHeight,
  occurrenceHeight,
  freeze,
}: Props) {
  const [scrollPercentage, setScrollPercentage] = useState(() => getScrollPercentage());
  const [screenPercentage, setScreenPercentage] = useState(() => getScreenPercentage());

  useEffect(() => {
    if (freeze) return;
    setScreenPercentage(getScreenPercentage());
    setScrollPercentage(getScrollPercentage());
  }, [freeze, listHeight, occurrenceHeight, viewType]);

  useEffect(() => {
    if (freeze) return;

    function onScroll() {
      setScrollPercentage(getScrollPercentage());
    }

    window.addEventListener('scroll', onScroll);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('scroll', onScroll);
  }, [freeze]);

  useEffect(() => {
    if (freeze) return;

    function onZoomOrResize() {
      setScreenPercentage(getScreenPercentage());
    }

    window.addEventListener('zoom', onZoomOrResize);
    window.addEventListener('resize', onZoomOrResize);
    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('zoom', onZoomOrResize);
      window.removeEventListener('resize', onZoomOrResize);
    };
  }, [freeze]);

  const barTravelDistance = (100 - screenPercentage) / 100;

  const scrollbarStyle = viewType === 'list'
    ? { top: `${scrollPercentage.fromTop * barTravelDistance}%` }
    : { top: `${100 - screenPercentage - scrollPercentage.fromBottom * barTravelDistance}%` };

  let scrollbarClass = 'scrollbar';

  if (screenPercentage === 100) {
    scrollbarClass += ' hidden';
  }

  return (
    <div className={scrollbarClass}>
      <div className="scrollbar-track">
        <div
          className="scrollbar-bar"
          style={{
            ...scrollbarStyle,
            height: `${screenPercentage}%`,
          }}
        />
      </div>
    </div>
  );
}
