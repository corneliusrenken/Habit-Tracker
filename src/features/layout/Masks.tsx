import React, { useCallback } from 'react';
import useLatch from '../common/useLatch';

// goal:
// top and bottom margins have a full white mask
// behind dates and days, there's a mask that prevents click but has no color
// behind dates, days, and extending downwards, there's a mask ignoring click but has fade color
// - bonus: this mask should allow greyed out elements to be just as visible behind it as black el

type Props = {
  freezeScroll: boolean;
  scrollPos: number;
};

export default function Masks({ freezeScroll, scrollPos }: Props) {
  const translucentMaskExpandPercentage = useLatch<number>(
    Math.min(1, scrollPos / 25),
    useCallback((lastPercentage) => {
      if (freezeScroll) return lastPercentage;
      return Math.min(1, scrollPos / 25);
    }, [scrollPos, freezeScroll]),
  );

  return (
    <div className="masks">
      <div
        className="mask full"
        style={{
          height: 'calc(75px + var(--layout-vertical-margin))',
          bottom: 'calc(-75px + 50px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black var(--layout-vertical-margin), transparent)',
        }}
      />
      <div
        className="mask full"
        style={{
          height: 'var(--layout-vertical-margin)',
          bottom: 'calc(50px + var(--layout-vertical-margin, 0px) - 100vh)',
        }}
      />
      <div
        className="mask block-mouse"
        style={{
          height: '100px',
          bottom: '-50px',
        }}
      />
      <div
        className="mask translucent"
        style={{
          height: `${100 + 28 * translucentMaskExpandPercentage}px`,
          bottom: `-${50 + 28 * translucentMaskExpandPercentage}px`,
          WebkitMaskImage: `linear-gradient(to bottom, black ${100 - 35 * translucentMaskExpandPercentage}%, transparent)`,
        }}
      />
    </div>
  );
}
