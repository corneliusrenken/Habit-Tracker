/* eslint-disable no-underscore-dangle */
import { writeFile, access } from 'fs/promises';
import { join } from 'path';
import getConfig from './getConfig';
import { Config, configPath } from '../../defaultConfig';
import moveDatabase from './moveDatabase';
import MutuallyExclusiveUnion from '../../../helpers/MutuallyExclusiveUnion';
import overwriteMutuallyDefinedValues from '../../../../features/common/overwriteMutuallyDefinedValues';

export default async function updateConfig(updateData: MutuallyExclusiveUnion<Omit<Config, '_databaseFileName'>>) {
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
