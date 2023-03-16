import { Config } from '../../../api/config/defaultConfig';
import TaskQueue from '../../taskQueue';
import { updateConfigClient } from '../clientSideFunctions';
import { generateUpdateConfigTask } from '../taskGenerators';

type States = {
  queue: TaskQueue;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
};

export default function updateConfig(
  updateData: Partial<Config>,
  states: States,
) {
  updateConfigClient(updateData, states);
  states.queue.enqueue<'update-config'>(generateUpdateConfigTask(updateData));
}
