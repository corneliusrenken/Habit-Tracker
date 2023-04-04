import React from 'react';

type Props = {
  scrollPos: number;
};

export default function Masks({ scrollPos }: Props) {
  const translucentMaskExpandPercentage = Math.min(1, scrollPos / 25);

  return (
    <div>
      <div
        className="mask full"
        style={{
          height: 'max(75px + var(--layout-vertical-margin, 0px), 25px + var(--occurrence-height, 0px))',
          bottom: 'calc(-75px + 50px)',
          WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 75px), transparent)',
        }}
      />
      <div
        className="mask full"
        style={{
          height: 'var(--layout-vertical-margin, 0px)',
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
