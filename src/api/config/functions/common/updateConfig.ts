/* eslint-disable no-underscore-dangle */
import { writeFile, access } from 'fs/promises';
import { join } from 'path';
import getConfig from './getConfig';
import { Config, configPath } from '../../defaultConfig';
import moveDatabase from './moveDatabase';

export default async function updateConfig(updateData: Partial<Config>) {
  const oldConfig = await getConfig();
  // technically breaks if updateData is passed keys with undefined as value
  const newConfig = { ...oldConfig, ...updateData };

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
