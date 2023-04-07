/* eslint-disable no-underscore-dangle */
import { BrowserWindow, IpcMainInvokeEvent, nativeTheme } from 'electron';
import { access } from 'fs/promises';
import { writeFile } from 'atomically';
import { join } from 'path';
import getConfig from './getConfig';
import { Config, configPath } from '../../defaultConfig';
import moveDatabase from './moveDatabase';
import MutuallyExclusiveUnion from '../../../helpers/MutuallyExclusiveUnion';
import NonUnderscored from '../../../helpers/NonUnderscored';
import overwriteMutuallyDefinedValues from '../../../../features/common/overwriteMutuallyDefinedValues';
import getCurrentBackgroundColor from '../../../../getCurrentBackgroundColor';

export default async function updateConfig(
  e: IpcMainInvokeEvent,
  updateData: MutuallyExclusiveUnion<Pick<Config, keyof NonUnderscored<Config>>>,
) {
  const window = BrowserWindow.fromWebContents(e.sender);

  if (!window) throw new Error('No window found for event sender.');

  const oldConfig = await getConfig();
  const newConfig = overwriteMutuallyDefinedValues(oldConfig, updateData);

  const updatedTheme = oldConfig.theme !== newConfig.theme;

  if (updatedTheme) {
    const themeLowerCase = newConfig.theme.toLowerCase();
    if (themeLowerCase !== 'dark' && themeLowerCase !== 'light' && themeLowerCase !== 'system') {
      throw new Error('invalid theme value');
    }
    nativeTheme.themeSource = themeLowerCase;
    window.setBackgroundColor(getCurrentBackgroundColor());
  }

  const updatedDatabaseDirectoryPath = (
    oldConfig.databaseDirectoryPath !== newConfig.databaseDirectoryPath
  );

  if (updatedDatabaseDirectoryPath) {
    let databaseExistedAtOldLocation: boolean;
    try {
      const oldDatabaseFilePath = join(
        oldConfig.databaseDirectoryPath,
        oldConfig._databaseFileName,
      );
      await access(oldDatabaseFilePath);
      databaseExistedAtOldLocation = true;
    } catch {
      databaseExistedAtOldLocation = false;
    }

    if (databaseExistedAtOldLocation) {
      await moveDatabase(oldConfig, newConfig);
    }
  }

  return writeFile(configPath, JSON.stringify(newConfig, null, 2));
}
