import { ipcMain } from 'electron';
import {
  initializeDatabase,
  checkIfDatabaseExists,
} from './functions';

const channelFunctions = {
  'check-if-database-exists': checkIfDatabaseExists,
  'initialize-database': initializeDatabase,
};

const channels = Object.keys(channelFunctions) as (keyof typeof channelFunctions)[];

type ApiParameters = {
  [key in keyof typeof channelFunctions]: Parameters<typeof channelFunctions[key]>;
};

export type StartupApi = typeof channelFunctions;

export function setStartupIpcHandlers() {
  channels.forEach((channel) => {
    if (channel === 'check-if-database-exists') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](...args)
      ));
    }
    if (channel === 'initialize-database') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](...args)
      ));
    }
  });
}
