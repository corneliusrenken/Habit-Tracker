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

  if (updateData.theme) {
    if (updateData.theme === 'System') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', updateData.theme.toLowerCase());
    }
  }

  setConfig((previousConfig) => overwriteMutuallyDefinedValues(previousConfig, updateData));
}
