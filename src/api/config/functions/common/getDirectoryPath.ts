import { dialog } from 'electron';
import getConfig from './getConfig';

export default async function getDirectoryPath(): Promise<{
  canceled: boolean;
  filePath?: string;
}> {
  const { databaseDirectoryPath } = await getConfig();

  const {
    canceled,
    filePaths,
  } = await dialog.showOpenDialog({
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
