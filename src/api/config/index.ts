/* eslint-disable no-multiple-empty-lines */
// functionName: what the window function will be called
// channel: what channel ipc will listen for
// args: what arguments will be passed to database function after the db objec
//       what arguments window function will request

import { ipcMain } from 'electron';
import {
  getConfig,
  getDirectoryPath,
  updateConfig,
} from './functions';

const channelFunctions = {
  'update-config': updateConfig,
  'get-directory-path': getDirectoryPath,
  'get-config': getConfig,
};

const channels = Object.keys(channelFunctions) as (keyof typeof channelFunctions)[];

type ApiParameters = {
  [key in keyof typeof channelFunctions]: Parameters<typeof channelFunctions[key]>;
};

export type ConfigApi = typeof channelFunctions;

export function setConfigIpcHandlers() {
  channels.forEach((channel) => {
    if (channel === 'update-config') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](...args)
      ));
    }
    if (channel === 'get-directory-path') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](...args)
      ));
    }
    if (channel === 'get-config') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](...args)
      ));
    }
  });
}
