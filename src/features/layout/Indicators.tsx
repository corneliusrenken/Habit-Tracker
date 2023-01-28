import React, { useEffect } from 'react';

type LayoutOptions = {
  minMarginHeight: number;
  maxListHeight: number;
};

export default function Indicators({ options }: { options: LayoutOptions }) {
  useEffect(() => {
    document.documentElement.style.setProperty('--max-list-height', `${options.maxListHeight}px`);
  }, [options.maxListHeight]);

  return (
    <div>
      <div className="desired-margin-indicator" style={{ height: options.minMarginHeight, top: 0 }} />
      <div className="desired-margin-indicator" style={{ height: options.minMarginHeight, bottom: 0 }} />
      <div className="actual-margin" style={{ height: 'var(--margin-height)', top: 0 }} />
      <div className="actual-margin" style={{ height: 'var(--margin-height)', bottom: 0 }} />
      <div className="max-list-height-indicator" />
    </div>
  );
}
