import { ipcMain } from 'electron';
import { ParametersExceptFirst } from '../helpers/ParametersExceptFirst';
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
  [key in keyof typeof channelFunctions]: ParametersExceptFirst<typeof channelFunctions[key]>;
};

type ApiReturnTypes = {
  [key in keyof ApiParameters]: Promise<ReturnType<typeof channelFunctions[key]>>;
};

export type ConfigApi = {
  [key in keyof ApiParameters]: (...args: ApiParameters[key]) =>ApiReturnTypes[key];
};

export function setConfigIpcHandlers() {
  channels.forEach((channel) => {
    if (channel === 'update-config') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](e, ...args)
      ));
    }
    if (channel === 'get-config') {
      ipcMain.handle(channel, () => (
        channelFunctions[channel]()
      ));
    }
    if (channel === 'choose-directory-path') {
      ipcMain.handle(channel, (e, ...args: ApiParameters[typeof channel]) => (
        channelFunctions[channel](e, ...args)
      ));
    }
  });
}
