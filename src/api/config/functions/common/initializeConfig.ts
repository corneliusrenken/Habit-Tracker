import { writeFile } from 'fs/promises';
import defaultConfig, { configPath } from '../../defaultConfig';

export default async function initializeConfig() {
  await writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}
