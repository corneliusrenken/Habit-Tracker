/* eslint-disable no-underscore-dangle */
import { IpcMainInvokeEvent } from 'electron';
import { access } from 'fs/promises';
import { writeFile } from 'atomically';
import { join } from 'path';
import getConfig from './getConfig';
import { Config, configPath } from '../../defaultConfig';
import moveDatabase from './moveDatabase';
import MutuallyExclusiveUnion from '../../../helpers/MutuallyExclusiveUnion';
import NonUnderscored from '../../../helpers/NonUnderscored';
import overwriteMutuallyDefinedValues from '../../../../features/common/overwriteMutuallyDefinedValues';

export default async function updateConfig(
  e: IpcMainInvokeEvent,
  updateData: MutuallyExclusiveUnion<Pick<Config, keyof NonUnderscored<Config>>>,
) {
  const oldConfig = await getConfig();

  const newConfig = overwriteMutuallyDefinedValues(oldConfig, updateData);

  if (oldConfig.databaseDirectoryPath !== newConfig.databaseDirectoryPath) {
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
