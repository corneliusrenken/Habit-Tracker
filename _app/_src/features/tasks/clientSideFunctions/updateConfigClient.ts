import overwriteMutuallyDefinedValues from '../../common/overwriteMutuallyDefinedValues';
import { Config } from '../../../api/config/defaultConfig';

type States = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function updateConfigClient(
  updateData: Parameters<typeof window.electron['update-config']>[0],
  states: States,
) {
  const { setConfig } = states;

  setConfig((previousConfig) => overwriteMutuallyDefinedValues(previousConfig, updateData));
}
