import { writeFile } from 'fs/promises';
import getSettings from './getSettings';
import { Settings, settingsPath } from './initializeSettings';

export default async function writeSettings(updatedProperties: Partial<Settings>) {
  const settings = await getSettings();
  const newSettings: Settings = { ...settings, ...updatedProperties };
  return writeFile(settingsPath, JSON.stringify(newSettings, null, 2));
}
