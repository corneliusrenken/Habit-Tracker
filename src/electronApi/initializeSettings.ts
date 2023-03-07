import { join } from 'path';
import { app } from 'electron';
import { writeFile } from 'fs/promises';
import { homedir } from 'os';

export type Settings = {
  saveDirPath: string;
  theme: 'system' | 'light' | 'dark';
  startWeekOn: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
};

export const settingsPath = join(app.getPath('userData'), 'settings.json');

export default async function initializeSettings() {
  const defaultSettings: Settings = {
    saveDirPath: join(homedir(), 'Documents', 'Habit Tracker'),
    theme: 'system',
    startWeekOn: 'monday',
  };

  return writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2));
}
