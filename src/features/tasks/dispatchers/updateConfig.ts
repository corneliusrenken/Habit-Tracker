import { Config } from '../../../globalTypes';
import { updateConfigClient } from '../clientSideFunctions';

type States = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function updateConfig(
  updateData: Partial<Config>,
  states: States,
) {
  updateConfigClient(updateData, states);
}
