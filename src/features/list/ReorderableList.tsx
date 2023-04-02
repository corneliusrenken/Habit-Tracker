/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable arrow-body-style */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Habit } from '../../globalTypes';

type ReorderInfo = {
  active: false;
} | {
  active: true;
  id: number;
  position: number;
  initialMousePosition: { x: number; y: number };
  deltaMousePosition: { x: number; y: number };
  initialScroll: number;
  deltaScroll: number;
};

function checkForReorder(
  habits: Habit[],
  reorderInfo: ReorderInfo,
): { newHabits: Habit[]; newReorderInfo: ReorderInfo } {
  if (!reorderInfo.active) {
    return { newHabits: habits, newReorderInfo: reorderInfo };
  }

  const {
    position, deltaMousePosition, deltaScroll,
  } = reorderInfo;

  const distanceFromInitMousePosition = deltaMousePosition.y + deltaScroll;

  // how far you have to drag before the list item changes position
  // based on a item height of 50, min 25
  // having it right on 25 makes it feel a bit jumpy going back and forth
  // const changeThreshold = 30;
  const changeThreshold = 25;

  if (Math.abs(distanceFromInitMousePosition) <= changeThreshold) {
    return { newHabits: habits, newReorderInfo: reorderInfo };
  }

  let posChange = 1 + Math.floor((Math.abs(distanceFromInitMousePosition) - changeThreshold) / 50);

  // should move by 2, because 83 is greater than 30 + 1 * 50
  // so calculation should be distance - changeThreshold / 50

  const changeDirection = distanceFromInitMousePosition > 0 ? 1 : -1;

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

  const newReorderInfo = (
    JSON.parse(JSON.stringify(reorderInfo)) as Extract<ReorderInfo, { active: true }>
  );

  newReorderInfo.position += posChange;
  newReorderInfo.initialMousePosition.y += posChange * 50;
  newReorderInfo.deltaMousePosition.y -= posChange * 50;

  return { newHabits, newReorderInfo };
}

type Props = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export default function ReorderableList({ habits, setHabits }: Props) {
  const [reorderInfo, setReorderInfo] = useState<ReorderInfo>({ active: false });

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

      if (reorderInfo.active && reorderInfo.id === id) {
        const { deltaMousePosition, deltaScroll } = reorderInfo;
        style.top = `${position * 50 + deltaMousePosition.y + deltaScroll}px`;
        style.left = `${deltaMousePosition.x}px`;
        delete style.transition;
      }

      const startReordering = ({ clientX, clientY }: React.MouseEvent) => setReorderInfo({
        active: true,
        id,
        position,
        deltaMousePosition: { x: 0, y: 0 },
        initialMousePosition: { x: clientX, y: clientY },
        initialScroll: window.scrollY,
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
            backgroundColor: 'lightpink',
            padding: '10px 10px',
            height: '50px',
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
    if (reorderInfo.active) {
      const onScroll = () => {
        const { initialScroll } = reorderInfo;
        const deltaScroll = window.scrollY - initialScroll;
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
    if (reorderInfo.active) {
      const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
        const deltaMousePosition = {
          x: clientX - reorderInfo.initialMousePosition.x,
          y: clientY - reorderInfo.initialMousePosition.y,
        };

        const updatedReorderInfo = { ...reorderInfo, deltaMousePosition };

        const { newHabits, newReorderInfo } = checkForReorder(habits, updatedReorderInfo);

        setHabits(newHabits);
        setReorderInfo(newReorderInfo);
      };

      const onMouseUp = () => {
        setReorderInfo({ active: false });
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
    <>
      {reorderInfo.active && (
        <div style={{ position: 'fixed', top: 0, right: 0, margin: '10px' }}>
          <div>{`id: ${reorderInfo.id}`}</div>
          <div>{`position: ${reorderInfo.position}`}</div>
          <div>{`ΔMousePosition: ${reorderInfo.deltaMousePosition.x}, ${reorderInfo.deltaMousePosition.y}`}</div>
          <div>{`initialMousePosition: ${reorderInfo.initialMousePosition.x}, ${reorderInfo.initialMousePosition.y}`}</div>
          <div>{`initialScroll: ${reorderInfo.initialScroll}`}</div>
          <div>{`ΔScroll: ${reorderInfo.deltaScroll}`}</div>
        </div>
      )}
      <div style={{ position: 'relative', width: '350px', height: `${habits.length * 50}px` }}>
        {elements}
      </div>
    </>
  );
}
