import { ipcRenderer } from 'electron';
import { DatabaseApi } from './database';
import { ConfigApi } from './config';
import { StartupApi } from './startup';

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
  'choose-directory-path': () => ipcRenderer.invoke('choose-directory-path'),
  'get-config': () => ipcRenderer.invoke('get-config'),
};

const startupApi: StartupApi = {
  'check-if-database-exists': () => ipcRenderer.invoke('check-if-database-exists'),
  'initialize-database': () => ipcRenderer.invoke('initialize-database'),
};

const api = {
  ...databaseApi,
  ...configApi,
  ...startupApi,
};

export default api;
