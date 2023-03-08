import { writeFile } from 'fs/promises';
import getConfig from './getConfig';
import { Config, configPath } from './initializeConfig';

export default async function updateConfig(updatedProperties: Partial<Config>) {
  const config = await getConfig();
  const newConfig = { ...config, ...updatedProperties };
  return writeFile(configPath, JSON.stringify(newConfig, null, 2));
}
