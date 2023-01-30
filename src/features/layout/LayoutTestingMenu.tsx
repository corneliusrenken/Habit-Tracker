import React from 'react';
import './layoutTestingMenu.css';

type Props = {
  minMarginHeight: number;
  maxListHeight: number;
  listRows: number;
  occurrenceRows: number;
  setMinMarginHeight: React.Dispatch<React.SetStateAction<number>>;
  setMaxListHeight: React.Dispatch<React.SetStateAction<number>>;
  setListRows: React.Dispatch<React.SetStateAction<number>>;
  setOccurrenceRows: React.Dispatch<React.SetStateAction<number>>;
};

export default function LayoutTestingMenu({
  minMarginHeight,
  maxListHeight,
  listRows,
  occurrenceRows,
  setMinMarginHeight,
  setMaxListHeight,
  setListRows,
  setOccurrenceRows,
}: Props) {
  return (
    <div
      className="layout-testing-menu-container"
    >
      <div>
        <div>hide menu</div>
        <input
          type="checkbox"
          onChange={(e) => {
            document.documentElement.style.setProperty('--menu-opacity', e.target.checked ? '0' : '1');
          }}
        />
      </div>
      <div>
        <div>{`mininum margin height: ${minMarginHeight}px`}</div>
        <input
          type="range"
          value={minMarginHeight}
          min={0}
          max={400}
          onChange={(e) => (setMinMarginHeight(Number(e.target.value)))}
        />
      </div>
      <div>
        <div>{`max body height: ${maxListHeight}px`}</div>
        <input
          type="range"
          value={maxListHeight}
          min={200}
          max={1500}
          onChange={(e) => (setMaxListHeight(50 * Math.round(Number(e.target.value) / 50)))}
        />
      </div>
      <div>
        <div>{`list rows: ${listRows}`}</div>
        <input
          type="range"
          value={listRows}
          min={0}
          max={28}
          onChange={(e) => (setListRows(Number(e.target.value)))}
        />
      </div>
      <div>
        <div>{`occurrence rows: ${occurrenceRows}`}</div>
        <input
          type="range"
          value={occurrenceRows}
          min={0}
          max={27}
          onChange={(e) => (setOccurrenceRows(Number(e.target.value)))}
        />
      </div>
      <div
        style={{
          height: `${maxListHeight}px`,
          width: '5px',
          position: 'fixed',
          background: 'red',
          top: `calc(50vh - ${maxListHeight / 2}px)`,
          opacity: 'var(--menu-opacity)',
          left: 0,
          zIndex: 99,
        }}
      />
      <div
        style={{
          height: `${minMarginHeight}px`,
          width: '5px',
          position: 'fixed',
          background: 'blue',
          top: 0,
          opacity: 'var(--menu-opacity)',
          left: '5px',
          zIndex: 99,
          transition: 'opacity 0.1s',
        }}
      />
      <div
        style={{
          height: `${minMarginHeight}px`,
          width: '5px',
          position: 'fixed',
          background: 'blue',
          bottom: 0,
          opacity: 'var(--menu-opacity)',
          left: '5px',
          zIndex: 99,
          transition: 'opacity 0.1s',
        }}
      />
    </div>
  );
}
