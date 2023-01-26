import React from 'react';

type LayoutOptions = {
  marginHeight: number;
  maxListHeight: number;
};

export default function Indicators({ options }: { options: LayoutOptions }) {
  return (
    <>
      <div className="desired-margin-indicator" style={{ height: options.marginHeight, top: 0 }} />
      <div className="desired-margin-indicator" style={{ height: options.marginHeight, bottom: 0 }} />
      <div className="actual-margin" style={{ height: 'var(--margin-height)', top: 0 }} />
      <div className="actual-margin" style={{ height: 'var(--margin-height)', bottom: 0 }} />
      <div
        className="max-list-height-indicator"
        style={{
          height: options.maxListHeight,
          top: (window.innerHeight - options.maxListHeight) / 2,
        }}
      />
    </>
  );
}
