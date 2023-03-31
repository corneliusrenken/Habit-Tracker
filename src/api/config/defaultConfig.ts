import { join } from 'path';
import { homedir } from 'os';
import { app } from 'electron';

export const configPath = join(app.getPath('userData'), 'config.json');

export type Config = {
  databaseDirectoryPath: string;
  _databaseFileName: string;
  theme: 'System' | 'Light' | 'Dark';
  startWeekOn: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
};

const defaultConfig: Config = {
  databaseDirectoryPath: join(homedir(), 'Documents'),
  theme: 'System',
  startWeekOn: 'Mon',
  _databaseFileName: 'data.sqlite3',
};

export default defaultConfig;
