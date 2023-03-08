import { readFile } from 'fs/promises';
import { Config, configPath } from './initializeConfig';

export default async function getConfig(): Promise<Config> {
  return JSON.parse(await readFile(configPath, 'utf-8'));
}
