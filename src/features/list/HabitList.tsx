import React from 'react';
import {
  DateObject,
  Habit,
  ListView,
  OccurrenceData,
  Streaks,
} from '../../globalTypes';
import getLaunchAnimationDelays from './getLaunchAnimationDelays';
import HabitListItem from './HabitListItem';

type Props = {
  ignoreMouse: boolean;
  dateObject: DateObject;
  listView: ListView;
  occurrenceData: OccurrenceData;
  habits: Habit[];
  selectedStreaks: Streaks;
  selectedIndex: number | null;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  updateOccurrenceCompleted: (habitId: number, complete: boolean) => void;
};

export default function HabitList({
  ignoreMouse,
  dateObject,
  listView,
  occurrenceData,
  habits,
  selectedStreaks,
  selectedIndex,
  setSelectedIndex,
  updateOccurrenceCompleted,
}: Props) {
  const dayObject = listView.name === 'yesterday' ? dateObject.yesterday : dateObject.today;

  return (
    <div>
      {habits.map(({ name, id }, index) => {
        const completed = occurrenceData.dates[dayObject.dateString][id].complete;
        const selected = index === selectedIndex;

        return (
          <HabitListItem
            ignoreMouse={ignoreMouse}
            key={`${listView.name}-${id}`}
            name={name}
            streak={selectedStreaks[id].current}
            completed={completed}
            selected={selected}
            select={() => setSelectedIndex(index)}
            toggleCompleted={() => updateOccurrenceCompleted(id, !completed)}
            // don't really need this post launch but fine for now
            style={{ '--launch-animation-offset': `${getLaunchAnimationDelays(habits.length)[index]}ms` } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
