import React, { useEffect, useRef, useState } from 'react';

function calculateNewIndices(
  oldIndex: number,
  newIndex: number,
  elementStartingIndices: ElementIndices,
) {
  const newIndices: ElementIndices = {};

  const indexDifference = newIndex - oldIndex;

  Object.entries(elementStartingIndices).forEach(([id, startingIndex]) => {
    if (startingIndex === oldIndex) {
      newIndices[id] = newIndex;
    } else if (indexDifference > 0 && startingIndex > oldIndex && startingIndex <= newIndex) {
      newIndices[id] = startingIndex - 1;
    } else if (indexDifference < 0 && startingIndex < oldIndex && startingIndex >= newIndex) {
      newIndices[id] = startingIndex + 1;
    } else {
      newIndices[id] = startingIndex;
    }
  });

  return newIndices;
}

type ElementIndices = { [id: string]: number };

type Props = {
  elementConstructors: {
    id: number;
    // eslint-disable-next-line max-len
    elementConstructor: (onMouseDown: React.MouseEventHandler<HTMLButtonElement>) => () => JSX.Element;
  }[];
  height: number;
  width: number;
  onIndexChange: (newIndicesById: ElementIndices, changedId: number) => any;
  transition?: string;
  activeClass?: string;
  inactiveClass?: string;
};

export default function ReorderableList({
  elementConstructors,
  height,
  width,
  onIndexChange,
  transition,
  activeClass,
  inactiveClass,
}: Props) {
  const [startingMouseOffsetY, setStartingMouseOffsetY] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);
  const [startingScrollOffset, setStartingScrollOffset] = useState(0);
  const [reorderId, setReorderId] = useState<number | undefined>();
  const [elementStartingIndices, setElementStartingIndices] = useState<ElementIndices>({});
  const [elementCurrentIndices, setElementCurrentIndices] = useState<ElementIndices>({});

  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reorderId === undefined) return;

    const onMouseMove = (e: MouseEvent) => {
      const startingIndex = elementStartingIndices[reorderId];
      const currentIndex = elementCurrentIndices[reorderId];
      const dstFromOrigin = e.clientY - startingMouseOffsetY;
      const scrollOffset = window.scrollY - startingScrollOffset;
      const dstFromRestingPosition = (
        dstFromOrigin + scrollOffset - (currentIndex - startingIndex) * height
      );
      const listPositionsFromRestingPosition = dstFromRestingPosition / height;

      setMouseOffsetY(dstFromOrigin);

      if (currentIndex < elementConstructors.length - 1 && listPositionsFromRestingPosition > 0.5) {
        setElementCurrentIndices(calculateNewIndices(
          startingIndex,
          Math.min(
            currentIndex + Math.round(listPositionsFromRestingPosition),
            elementConstructors.length - 1,
          ),
          elementStartingIndices,
        ));
      } else if (currentIndex > 0 && listPositionsFromRestingPosition < -0.5) {
        setElementCurrentIndices(calculateNewIndices(
          startingIndex,
          Math.max(
            currentIndex + Math.round(listPositionsFromRestingPosition),
            0,
          ),
          elementStartingIndices,
        ));
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      onIndexChange(elementCurrentIndices, reorderId);
      setReorderId(undefined);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [
    elementConstructors.length,
    elementCurrentIndices,
    elementStartingIndices,
    height,
    startingMouseOffsetY,
    startingScrollOffset,
    onIndexChange,
    reorderId,
  ]);

  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, elementId: number) => {
    if (e.button !== 0) return;
    const currentIndices: ElementIndices = {};
    elementConstructors.forEach(({ id }, index) => { currentIndices[id] = index; });

    setMouseOffsetY(0);
    setStartingMouseOffsetY(e.clientY);
    setStartingScrollOffset(window.scrollY);
    setReorderId(elementId);
    setElementStartingIndices(currentIndices);
    setElementCurrentIndices(currentIndices);
  };

  return (
    <div
      ref={listContainerRef}
      style={{
        position: 'relative',
        height: `${elementConstructors.length * height}px`,
        width: `${width}px`,
      }}
    >
      {elementConstructors.map(({ id, elementConstructor }, index) => {
        const reordering = reorderId !== undefined;

        let top = `${index * height}px`;

        const listTop = listContainerRef.current?.getBoundingClientRect().top || 0;

        const elementRestingPosition = listTop + 50 * elementStartingIndices[id];

        const scrollOffset = window.scrollY - startingScrollOffset;

        if (reordering) {
          top = reorderId === id
            ? `${elementRestingPosition + mouseOffsetY + scrollOffset}px`
            : `${elementCurrentIndices[id] * 50}px`;
        }

        let className = '';

        if (activeClass && reordering && reorderId === id) {
          className = activeClass;
        }

        if (inactiveClass && reordering && reorderId !== id) {
          className = inactiveClass;
        }

        return (
          <div
            key={id}
            style={{
              position: reorderId === id ? 'fixed' : 'absolute',
              top,
              transition: transition && reordering && reorderId !== id ? `top ${transition}` : '',
            }}
            className={className || undefined}
          >
            {elementConstructor((e) => { onMouseDown(e, id); })()}
          </div>
        );
      })}
    </div>
  );
}

ReorderableList.defaultProps = {
  transition: '',
  activeClass: '',
  inactiveClass: '',
};
