// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { ExposedDatabaseApi } from './databaseApi';

const exposedDatabaseApi: ExposedDatabaseApi = {
  'initialize-app': (...args) => ipcRenderer.invoke('initialize-app', ...args),
  'add-habit': (...args) => ipcRenderer.invoke('add-habit', ...args),
  'delete-habit': (...args) => ipcRenderer.invoke('delete-habit', ...args),
  'update-habit': (...args) => ipcRenderer.invoke('update-habit', ...args),
  'add-occurrence': (...args) => ipcRenderer.invoke('add-occurrence', ...args),
  'delete-occurrence': (...args) => ipcRenderer.invoke('delete-occurrence', ...args),
  'update-occurrence': (...args) => ipcRenderer.invoke('update-occurrence', ...args),
};

contextBridge.exposeInMainWorld('electron', exposedDatabaseApi);

declare global {
  interface Window {
    electron: ExposedDatabaseApi;
  }
}
