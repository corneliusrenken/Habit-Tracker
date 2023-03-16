import { Config } from '../../../api/config/defaultConfig';

type States = {
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function updateConfigClient(
  updateData: Partial<Config>,
  states: States,
) {
  const { setConfig } = states;

  setConfig((previousConfig) => ({ ...previousConfig, ...updateData }));
}
