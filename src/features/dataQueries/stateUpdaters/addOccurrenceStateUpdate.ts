import { getMinimumDateString } from '../../common/dateStringFunctions';
import { OccurrenceData } from '../../../globalTypes';

type States = {
  setOccurrenceData: React.Dispatch<React.SetStateAction<OccurrenceData | undefined>>;
};

export default function addOccurrenceStateUpdate(
  habitId: number,
  date: string,
  states: States,
) {
  const { setOccurrenceData } = states;

  setOccurrenceData((previousOccurrenceData) => {
    if (!previousOccurrenceData) throw new Error('state should not be undefined');

    if (previousOccurrenceData.dates[date] === undefined) {
      throw new Error('day entry for the passed date doesn\'t exist');
    }

    if (previousOccurrenceData.dates[date][habitId] !== undefined) {
      throw new Error('occurrence with the given parameters already exists');
    }

    const newOccurrenceData: OccurrenceData = JSON.parse(JSON.stringify(previousOccurrenceData));

    newOccurrenceData.oldest[habitId] = getMinimumDateString([
      previousOccurrenceData.oldest[habitId],
      date,
    ]);

    newOccurrenceData.dates[date][habitId] = { complete: false, visible: true };

    return newOccurrenceData;
  });
}
