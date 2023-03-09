import { join } from 'path';
import { homedir } from 'os';
import { app } from 'electron';

export const configPath = join(app.getPath('userData'), 'config.json');

export type Config = {
  databaseDirectoryPath: string;
  _databaseFolderName: string;
  _databaseFileName: string;
  theme: 'system' | 'light' | 'dark';
  startWeekOn: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
};

const defaultConfig: Config = {
  databaseDirectoryPath: join(homedir(), 'Documents'),
  theme: 'system',
  startWeekOn: 'monday',
  _databaseFolderName: 'habit tracker',
  _databaseFileName: 'data.sqlite3',
};

export default defaultConfig;
