import { readFile } from 'atomically';
import { Config, configPath } from '../../defaultConfig';

export default async function getConfig(): Promise<Config> {
  return JSON.parse(await readFile(configPath, 'utf-8'));
}
