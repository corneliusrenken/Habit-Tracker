import { ipcMain } from 'electron';
import {
  chooseDirectoryPath,
  getConfig,
  updateConfig,
} from './functions';

const channelFunctions = {
  'choose-directory-path': chooseDirectoryPath,
  'update-config': updateConfig,
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
    if (channel === 'choose-directory-path') {
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
