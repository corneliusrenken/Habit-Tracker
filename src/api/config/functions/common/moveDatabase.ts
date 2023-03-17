/* eslint-disable no-underscore-dangle */
import {
  unlink,
  copyFile,
} from 'fs/promises';
import { join } from 'path';
import { closeDatabase, setDatabaseIpcHandlers } from '../../../database';
import { openDatabase } from '../../../database/functions';
import { Config } from '../../defaultConfig';

export default async function moveDatabase(oldConfig: Config, newConfig: Config) {
  const oldDatabaseFilePath = join(
    oldConfig.databaseDirectoryPath,
    oldConfig._databaseFileName,
  );

  const newDatabaseFilePath = join(
    newConfig.databaseDirectoryPath,
    newConfig._databaseFileName,
  );

  // need to close database so changes are written to disk
  closeDatabase();

  await copyFile(oldDatabaseFilePath, newDatabaseFilePath);

  const database = openDatabase(newDatabaseFilePath);
  setDatabaseIpcHandlers(database);

  await unlink(oldDatabaseFilePath);
}
