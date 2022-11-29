import axios from 'axios';
import { OccurrenceData } from '../../globalTypes';

type States = {
  occurrenceData: OccurrenceData | undefined;
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function updateHabitVisibility(
  habitId: number,
  visible: boolean,
  dateString: string,
  states: States,
) {
  const { occurrenceData, setOccurrenceData } = states;

  if (!occurrenceData) throw new Error('states should not be undefined');

  const occurrencesToday = { ...occurrenceData.dates[dateString] };

  if (visible) {
    axios({
      method: 'post',
      url: '/api/occurrences',
      data: {
        occurrences: [
          { habitId, completed: false, dateString },
        ],
      },
    });
    occurrencesToday[habitId] = false;
  } else {
    axios({
      method: 'delete',
      url: `/api/occurrences/${habitId}/${dateString}`,
    });
    delete occurrencesToday[habitId];
  }

  const newOccurrenceData: OccurrenceData = {
    ...occurrenceData,
    dates: {
      ...occurrenceData.dates,
      [dateString]: occurrencesToday,
    },
  };

  setOccurrenceData(newOccurrenceData);
}
