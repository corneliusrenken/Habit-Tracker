import React from 'react';

type Props = {
  index: number;
};

function Selector({ index }: Props) {
  return (
    <div
      className="selector"
      style={{ top: `${22 + index * 50}px` }}
    />
  );
}

export default Selector;
