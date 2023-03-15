import { join } from 'path';
import { homedir } from 'os';
import { app } from 'electron';

export const configPath = join(app.getPath('userData'), 'config.json');

export type Config = {
  databaseDirectoryPath: string;
  _databaseFolderName: string;
  _databaseFileName: string;
  theme: 'System' | 'Light' | 'Dark';
  style: 'Complete' | 'Minimal';
  startWeekOn: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
};

const defaultConfig: Config = {
  databaseDirectoryPath: join(homedir(), 'Documents'),
  theme: 'System',
  startWeekOn: 'Mon',
  style: 'Complete',
  _databaseFolderName: 'habit tracker',
  _databaseFileName: 'data.sqlite3',
};

export default defaultConfig;
