import { readFile } from 'fs/promises';
import { Settings, settingsPath } from './initializeSettings';

export default async function getSettings(): Promise<Settings> {
  return JSON.parse(await readFile(settingsPath, 'utf-8'));
}
