import { Config } from '../../../globalTypes';
import overwriteMutuallyDefinedValues from '../../common/overwriteMutuallyDefinedValues';

type States = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function updateConfigClient(
  updateData: Partial<Config>,
  states: States,
) {
  const { setConfig } = states;

  setConfig((previousConfig) => overwriteMutuallyDefinedValues(previousConfig, updateData));
}
