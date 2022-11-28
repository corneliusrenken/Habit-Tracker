import axios from 'axios';
import { OccurrenceData } from '../../globalTypes';

type States = {
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function updateHabitCompleted(
  habitId: number,
  completed: boolean,
  dateString: string,
  states: States,
) {
  const { occurrenceData, setOccurrenceData } = states;

  if (!occurrenceData) throw new Error('states should not be undefined');

  axios({
    method: 'patch',
    url: `/api/occurrences/${habitId}/${dateString}`,
    data: {
      completed,
    },
  });

  const newOccurrenceData = {
    ...occurrenceData,
    dates: {
      ...occurrenceData.dates,
      [dateString]: {
        ...occurrenceData.dates[dateString],
        [habitId]: completed,
      },
    },
  };

  setOccurrenceData(newOccurrenceData);
}
