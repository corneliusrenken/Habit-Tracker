/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable arrow-body-style */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Habit } from '../../globalTypes';

type ReorderInfo = {
  id: null;
} | {
  id: number;
  position: number;
  restingPosition: { x: number; y: number };
  deltaPosition: { x: number; y: number };
  initialScrollPosition: number;
  deltaScroll: number;
};

function checkForReorder(
  habits: Habit[],
  reorderInfo: ReorderInfo,
): { newHabits: Habit[]; newReorderInfo: ReorderInfo } {
  if (reorderInfo.id === null) {
    return { newHabits: habits, newReorderInfo: reorderInfo };
  }

  const {
    position, deltaPosition, deltaScroll,
  } = reorderInfo;

  const distanceFromRestingPosition = deltaPosition.y + deltaScroll;

  if (Math.abs(distanceFromRestingPosition) < 25) {
    return { newHabits: habits, newReorderInfo: reorderInfo };
  }

  let posChange = Math.floor((Math.abs(distanceFromRestingPosition) + 25) / 50);

  const changeDirection = distanceFromRestingPosition > 0 ? 1 : -1;

  posChange *= changeDirection;

  const maxPosition = habits.length - 1;
  const maxPosChange = maxPosition - position;
  const minPosChange = -position;

  posChange = Math.min(
    maxPosChange,
    Math.max(minPosChange, posChange),
  );

  const newHabits: Habit[] = [];

  if (posChange > 0) {
    habits.forEach((habit, index) => {
      if (index === position) {
        newHabits[index + posChange] = habit;
      } else if (index > position && index <= position + posChange) {
        newHabits[index - 1] = habit;
      } else {
        newHabits[index] = habit;
      }
    });
  } else {
    habits.forEach((habit, index) => {
      if (index === position) {
        newHabits[index + posChange] = habit;
      } else if (index < position && index >= position + posChange) {
        newHabits[index + 1] = habit;
      } else {
        newHabits[index] = habit;
      }
    });
  }

  const newReorderInfo: ReorderInfo = { ...reorderInfo };

  newReorderInfo.position += posChange;
  newReorderInfo.restingPosition.y += posChange * 50;
  newReorderInfo.deltaPosition.y -= posChange * 50;

  return { newHabits, newReorderInfo };
}

type Props = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export default function ReorderableList({ habits, setHabits }: Props) {
  const [reorderInfo, setReorderInfo] = useState<ReorderInfo>({ id: null });

  const elements = useMemo(() => {
    // sort by id to ensure order of elements in dom is consistent
    const habitsSortedById = [...habits].sort((a, b) => a.id - b.id);

    return habitsSortedById.map(({ name, id }) => {
      const position = habits.findIndex((habit) => habit.id === id);

      const style: React.CSSProperties = {
        top: `${position * 50}px`,
        left: '0px',
        transition: 'top 0.2s ease, left 0.2s ease',
      };

      if (reorderInfo.id === id) {
        const { deltaPosition, deltaScroll } = reorderInfo;
        style.top = `${position * 50 + deltaPosition.y + deltaScroll}px`;
        style.left = `${deltaPosition.x}px`;
        delete style.transition;
      }

      const startReordering = ({ clientX, clientY }: React.MouseEvent) => setReorderInfo({
        id,
        position,
        deltaPosition: { x: 0, y: 0 },
        restingPosition: { x: clientX, y: clientY },
        initialScrollPosition: window.scrollY,
        deltaScroll: 0,
      });

      return (
        <div
          key={id}
          style={{
            ...style,
            position: 'absolute',
            display: 'flex',
            justifyContent: 'space-between',
            width: '350px',
          }}
        >
          {name}
          <button
            type="button"
            onMouseDown={startReordering}
            style={{
              backgroundColor: 'lightgrey',
              padding: '5px',
            }}
          >
            move
          </button>
        </div>
      );
    });
  }, [habits, reorderInfo]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (reorderInfo.id) {
      const onScroll = () => {
        const { initialScrollPosition } = reorderInfo;
        const deltaScroll = window.scrollY - initialScrollPosition;
        const updatedReorderInfo = { ...reorderInfo, deltaScroll };

        const { newHabits, newReorderInfo } = checkForReorder(habits, updatedReorderInfo);

        setHabits(newHabits);
        setReorderInfo(newReorderInfo);
      };

      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [reorderInfo, habits, setHabits]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (reorderInfo.id !== null) {
      const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
        const deltaPosition = {
          x: clientX - reorderInfo.restingPosition.x,
          y: clientY - reorderInfo.restingPosition.y,
        };

        const updatedReorderInfo = { ...reorderInfo, deltaPosition };

        const { newHabits, newReorderInfo } = checkForReorder(habits, updatedReorderInfo);

        setHabits(newHabits);
        setReorderInfo(newReorderInfo);
      };

      const onMouseUp = () => {
        setReorderInfo({ id: null });
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);

      return () => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [habits, reorderInfo, setHabits]);

  return (
    <div style={{ position: 'relative' }}>
      {elements}
    </div>
  );
}
