import { ipcRenderer } from 'electron';
import { DatabaseApi } from './database';
import { ConfigApi } from './config';

const databaseApi: DatabaseApi = {
  'initialize-app': (...args) => ipcRenderer.invoke('initialize-app', ...args),
  'add-habit': (...args) => ipcRenderer.invoke('add-habit', ...args),
  'delete-habit': (...args) => ipcRenderer.invoke('delete-habit', ...args),
  'update-habit': (...args) => ipcRenderer.invoke('update-habit', ...args),
  'add-occurrence': (...args) => ipcRenderer.invoke('add-occurrence', ...args),
  'delete-occurrence': (...args) => ipcRenderer.invoke('delete-occurrence', ...args),
  'update-occurrence': (...args) => ipcRenderer.invoke('update-occurrence', ...args),
};

const configApi: ConfigApi = {
  'update-config': (...args) => ipcRenderer.invoke('update-config', ...args),
  'get-directory-path': () => ipcRenderer.invoke('get-directory-path'),
  'get-config': () => ipcRenderer.invoke('get-config'),
};

const api = {
  ...databaseApi,
  ...configApi,
  'open-database': (directoryPath: string) => ipcRenderer.invoke('open-database', directoryPath),
  'check-database-exists': (directoryPath: string) => ipcRenderer.invoke('check-database-exists', directoryPath),
};

export default api;
