import React, { useEffect, useState } from 'react';
import { View, viewToViewType } from '../../globalTypes';
import getScreenPercentage from './getScreenPercentage';
import getScrollPercentage from './getScrollPercentage';

type Props = {
  view: View;
  screenHeight: number;
};

export default function Scrollbar({
  view,
  screenHeight,
}: Props) {
  const [scrollPercentage, setScrollPercentage] = useState(() => getScrollPercentage());
  const [screenPercentage, setScreenPercentage] = useState(() => getScreenPercentage());

  useEffect(() => {
    setScrollPercentage(getScrollPercentage());

    function onScroll() {
      setScrollPercentage(getScrollPercentage());
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [screenHeight]);

  useEffect(() => {
    setScreenPercentage(getScreenPercentage());

    function onZoomOrResize() {
      setScreenPercentage(getScreenPercentage());
    }

    window.addEventListener('zoom', onZoomOrResize);
    window.addEventListener('resize', onZoomOrResize);
    return () => {
      window.removeEventListener('zoom', onZoomOrResize);
      window.removeEventListener('resize', onZoomOrResize);
    };
  }, [screenHeight]);

  const barTravelDistance = (100 - screenPercentage) / 100;

  const scrollbarStyle = viewToViewType[view.name] === 'list'
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
