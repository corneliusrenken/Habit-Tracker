/* eslint-disable no-multiple-empty-lines */
// functionName: what the window function will be called
// channel: what channel ipc will listen for
// args: what arguments will be passed to database function after the db objec
//       what arguments window function will request

import { Database } from 'better-sqlite3';
import { ipcMain } from 'electron';
import {
  initializeApp,
  addHabit,
  deleteHabit,
  updateHabit,
  addOccurrences,
  deleteOccurrence,
  updateOccurrence,
} from './functions';

// https://stackoverflow.com/a/67605309
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never;

const channelFunctions = {
  'initialize-app': initializeApp,
  'add-habit': addHabit,
  'delete-habit': deleteHabit,
  'update-habit': updateHabit,
  'add-occurrence': (database: Database, options: { habitId: number, date: string }) => {
    const { habitId, date } = options;
    addOccurrences(database, { habitIds: [habitId], date });
  },
  'delete-occurrence': deleteOccurrence,
  'update-occurrence': updateOccurrence,
};

const channels = Object.keys(channelFunctions) as (keyof typeof channelFunctions)[];

type ApiParameters = {
  [key in keyof typeof channelFunctions]: ParametersExceptFirst<typeof channelFunctions[key]>;
};

type ApiReturnTypes = {
  [key in keyof ApiParameters]: Promise<ReturnType<typeof channelFunctions[key]>>;
};

export type DatabaseApi = {
  [key in keyof ApiParameters]: (...args: ApiParameters[key]) =>ApiReturnTypes[key];
};

let lastDatabase: Database | null = null;

export function setDatabaseIpcHandlers(database: Database) {
  lastDatabase = database;

  channels.forEach((channel) => {
    ipcMain.removeHandler(channel);

    if (channel === 'initialize-app') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
    if (channel === 'add-habit') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
    if (channel === 'delete-habit') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
    if (channel === 'update-habit') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
    if (channel === 'add-occurrence') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
    if (channel === 'delete-occurrence') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
    if (channel === 'update-occurrence') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](database, ...args)
      ));
    }
  });
}

export function closeDatabase() {
  if (!lastDatabase) {
    throw new Error('Tried to close database before ever setting ipc handlers');
  }
  if (lastDatabase) lastDatabase.close();
}
