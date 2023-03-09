import { contextBridge } from 'electron';
import api from './api';

contextBridge.exposeInMainWorld('electron', api);

declare global {
  interface Window {
    electron: typeof api;
  }
}
