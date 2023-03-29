import { BrowserWindow, dialog, IpcMainInvokeEvent } from 'electron';
import getConfig from './getConfig';

export default async function chooseDirectoryPath(e: IpcMainInvokeEvent): Promise<{
  canceled: boolean;
  filePath?: string;
}> {
  const { databaseDirectoryPath } = await getConfig();

  const window = BrowserWindow.fromWebContents(e.sender);

  if (!window) throw new Error('No window found for event sender.');

  const {
    canceled,
    filePaths,
  } = await dialog.showOpenDialog(window, {
    defaultPath: databaseDirectoryPath,
    buttonLabel: 'Select',
    properties: ['openDirectory', 'createDirectory'],
  });

  if (canceled || filePaths.length === 0) return { canceled: true };

  return {
    canceled: false,
    filePath: filePaths[0],
  };
}
