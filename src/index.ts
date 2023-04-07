import {
  app,
  BrowserWindow,
  nativeTheme,
  systemPreferences,
} from 'electron';
import windowStateKeeper from 'electron-window-state';
import { setConfigIpcHandlers } from './api/config';
import { Config } from './api/config/defaultConfig';
import initializeConfig from './api/config/functions/common/initializeConfig';
import { setStartupIpcHandlers } from './api/startup';
import { getConfig } from './api/config/functions';
import getCurrentBackgroundColor from './getCurrentBackgroundColor';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1050,
    defaultHeight: 700,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    backgroundColor: getCurrentBackgroundColor(),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      scrollBounce: true,
    },
    titleBarStyle: 'hiddenInset',
    minHeight: 350,
    minWidth: 500,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindowState.manage(mainWindow);
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// database ipc handlers set in initializeDatabase
setConfigIpcHandlers();
setStartupIpcHandlers();

(async () => {
  let config : Config;

  try {
    config = await getConfig();
  } catch {
    config = await initializeConfig();
  }

  // set nativeTheme.themeSource to match config
  const themeLowerCase = config.theme.toLowerCase();
  if (themeLowerCase !== 'dark' && themeLowerCase !== 'light' && themeLowerCase !== 'system') {
    throw new Error('invalid theme value');
  }
  nativeTheme.themeSource = themeLowerCase;

  await app.whenReady();

  createWindow();
})();

systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', async () => {
  setTimeout(() => {
    if (mainWindow === null) return;
    mainWindow.setBackgroundColor(getCurrentBackgroundColor());
  }, 0);
});
