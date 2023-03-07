import { dialog } from 'electron';
import {
  rmdir,
  mkdir,
  readdir,
  copyFile,
} from 'fs/promises';
import { join } from 'path';
import getSettings from './getSettings';

export default async function updateSaveDirPath(): Promise<{
  canceled: boolean;
  completed?: boolean;
}> {
  const { saveDirPath } = await getSettings();

  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: saveDirPath,
  });

  if (canceled || filePath === undefined) return { canceled: true };

  await mkdir(saveDirPath);

  const files = await readdir(saveDirPath);
  await Promise.all(files.map((file) => copyFile(file, join(saveDirPath, file))));

  await rmdir(saveDirPath);

  return {
    canceled: false,
    completed: true,
  };
}
