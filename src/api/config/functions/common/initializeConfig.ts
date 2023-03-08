import { join } from 'path';
import { app } from 'electron';
import { writeFile } from 'fs/promises';
import { homedir } from 'os';

export type Config = {
  databaseDirectoryPath: string;
  _databaseFileName: string;
  theme: 'system' | 'light' | 'dark';
  startWeekOn: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
};

export const configPath = join(app.getPath('userData'), 'config.json');

export default async function initializeConfig() {
  const defaultConfig: Config = {
    // databasePath: join(homedir(), 'Documents', 'Habit Tracker'),
    databaseDirectoryPath: join(homedir(), 'Downloads', 'Habit Tracker Data'),
    _databaseFileName: 'habit-tracker.sqlite3',
    theme: 'system',
    startWeekOn: 'monday',
  };

  await writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}
