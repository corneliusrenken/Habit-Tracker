import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Habit } from '../../globalTypes';
import getVerticalMarginHeight from '../common/getVerticalMarginHeight';
import getReorderTranslateTime from './getReorderTranslateTime';

type ReorderInfo = {
  active: false;
} | {
  active: true;
  id: number;
  position: number;
  restingMousePosition: { x: number; y: number };
  deltaMousePosition: { x: number; y: number };
  actualMousePosition: { x: number; y: number };
  initialScroll: number;
  deltaScroll: number;
  actualScroll: number;
};

function checkForReorder(
  habits: Habit[],
  reorderInfo: ReorderInfo,
  updateHabitListPosition: (habitId: number, newPosition: number) => void,
): { newReorderInfo: ReorderInfo } {
  if (!reorderInfo.active) {
    return { newReorderInfo: reorderInfo };
  }

  const {
    position, deltaMousePosition, deltaScroll, actualMousePosition,
  } = reorderInfo;

  let distanceFromRestMousePosition = deltaMousePosition.y + deltaScroll;

  // reorder shouldn't happen when mouse is moving beyond the top or bottom of the list
  const verticalMarginHeight = getVerticalMarginHeight();
  const listBounds = {
    top: verticalMarginHeight + 100,
    bottom: window.innerHeight - verticalMarginHeight,
  };
  const { y } = actualMousePosition;

  if (y < listBounds.top) {
    const outOfBoundsAmt = listBounds.top - y;
    distanceFromRestMousePosition += outOfBoundsAmt;
  } else if (y > listBounds.bottom) {
    const outOfBoundsAmt = y - listBounds.bottom;
    distanceFromRestMousePosition -= outOfBoundsAmt;
  }

  // how far you have to drag before the list item changes position
  // based on a item height of 50, min 25
  // having it right on 25 makes it feel a bit jumpy going back and forth
  const changeThreshold = 30;

  if (Math.abs(distanceFromRestMousePosition) <= changeThreshold) {
    return { newReorderInfo: reorderInfo };
  }

  let posChange = 1 + Math.floor((Math.abs(distanceFromRestMousePosition) - changeThreshold) / 50);

  const changeDirection = distanceFromRestMousePosition > 0 ? 1 : -1;

  posChange *= changeDirection;

  const maxPosition = habits.length - 1;
  const maxPosChange = maxPosition - position;
  const minPosChange = -position;

  posChange = Math.min(
    maxPosChange,
    Math.max(minPosChange, posChange),
  );

  updateHabitListPosition(reorderInfo.id, position + posChange);

  const newReorderInfo = (
    JSON.parse(JSON.stringify(reorderInfo)) as Extract<ReorderInfo, { active: true }>
  );

  newReorderInfo.position += posChange;
  newReorderInfo.restingMousePosition.y += posChange * 50;
  newReorderInfo.deltaMousePosition.y -= posChange * 50;

  return { newReorderInfo };
}

type Props = {
  prepopulatedListItem: (
    habit: Habit,
    position: number,
    reorder: (e: React.MouseEvent) => void,
    styleAdditions?: React.CSSProperties,
    classNameAdditions?: string,
  ) => JSX.Element;
  habits: Habit[];
  setReorderingList: React.Dispatch<React.SetStateAction<boolean>>;
  updateHabitListPosition: (habitId: number, newPosition: number) => void;
};

export default function ReorderableList({
  prepopulatedListItem,
  habits,
  setReorderingList,
  updateHabitListPosition,
}: Props) {
  const [reorderInfo, setReorderInfo] = useState<ReorderInfo>({ active: false });
  const [idReturningToRestingPos, setIdReturningToRestingPos] = useState<number | null>(null);

  const elements = useMemo(() => {
    // sort by id to ensure order of elements in dom is consistent preventing rerender on move
    const habitsSortedById = [...habits].sort((a, b) => a.id - b.id);

    return habitsSortedById.map((habit) => {
      const beingReordered = reorderInfo.active && reorderInfo.id === habit.id;
      const position = habits.findIndex(({ id }) => habit.id === id);

      const styleAdditions: React.CSSProperties = beingReordered
        ? {
          top: `${position * 50 + reorderInfo.deltaMousePosition.y + reorderInfo.deltaScroll}px`,
          left: `${reorderInfo.deltaMousePosition.x}px`,
        } : {
          top: `${position * 50}px`,
          left: '0px',
        };

      if (idReturningToRestingPos === habit.id) {
        styleAdditions.zIndex = 3;
      }

      const startReordering = ({ clientX, clientY }: React.MouseEvent) => setReorderInfo({
        active: true,
        id: habit.id,
        position,
        deltaMousePosition: { x: 0, y: 0 },
        restingMousePosition: { x: clientX, y: clientY },
        actualMousePosition: { x: clientX, y: clientY },
        initialScroll: window.scrollY,
        actualScroll: window.scrollY,
        deltaScroll: 0,
      });

      let classNameAdditions = '';
      if (beingReordered) classNameAdditions += ' reordered-item';

      return prepopulatedListItem(
        habit,
        position,
        startReordering,
        styleAdditions,
        classNameAdditions,
      );
    });
  }, [habits, prepopulatedListItem, reorderInfo, idReturningToRestingPos]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (reorderInfo.active) {
      const onScroll = () => {
        const { initialScroll } = reorderInfo;
        const deltaScroll = window.scrollY - initialScroll;
        const updatedReorderInfo = {
          ...reorderInfo,
          deltaScroll,
          actualScroll: window.scrollY,
        };

        const {
          newReorderInfo,
        } = checkForReorder(habits, updatedReorderInfo, updateHabitListPosition);

        setReorderInfo(newReorderInfo);
      };

      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [reorderInfo, habits, updateHabitListPosition]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (reorderInfo.active) {
      const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
        const deltaMousePosition = {
          x: clientX - reorderInfo.restingMousePosition.x,
          y: clientY - reorderInfo.restingMousePosition.y,
        };

        const updatedReorderInfo = {
          ...reorderInfo,
          deltaMousePosition,
          actualMousePosition: { x: clientX, y: clientY },
        };

        const {
          newReorderInfo,
        } = checkForReorder(habits, updatedReorderInfo, updateHabitListPosition);

        setReorderInfo(newReorderInfo);
      };

      const onMouseUp = () => {
        const { id } = reorderInfo;
        setReorderInfo({ active: false });
        setReorderingList(false);

        setIdReturningToRestingPos(id);
        setTimeout(() => {
          setIdReturningToRestingPos(null);
        }, getReorderTranslateTime());

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
  }, [habits, reorderInfo, setReorderingList, updateHabitListPosition]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {elements}
    </>
  );
}
