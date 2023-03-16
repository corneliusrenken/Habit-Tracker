import { writeFile } from 'fs/promises';
import getConfig from './getConfig';
import { Config, configPath } from '../../defaultConfig';

export default async function updateConfig(updateData: Partial<Config>) {
  const config = await getConfig();
  // technically breaks if updateData is passed keys with undefined as value
  const newConfig = { ...config, ...updateData };
  return writeFile(configPath, JSON.stringify(newConfig, null, 2));
}
