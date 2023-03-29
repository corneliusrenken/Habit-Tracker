/* eslint-disable no-underscore-dangle */
import {
  access,
  unlink,
} from 'fs/promises';
import { join } from 'path';
import { getCurrentDatabaseConnection, setDatabaseIpcHandlers } from '../../../database';
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

  const currentDatabase = getCurrentDatabaseConnection();

  // using copyFile, renameFile, or readFile/writeFile caused the database to not copy correctly,
  // backup seems to work (creates a copy of the db)
  await currentDatabase.backup(newDatabaseFilePath);

  currentDatabase.close();

  const newDatabase = openDatabase(newDatabaseFilePath);

  setDatabaseIpcHandlers(newDatabase);

  await unlink(oldDatabaseFilePath);

  // files from pragma are sometimes not cleaned up
  const walFilePath = `${oldDatabaseFilePath}-wal`;
  const shmFilePath = `${oldDatabaseFilePath}-shm`;

  try {
    await access(walFilePath);
    await unlink(walFilePath);
  } catch { /* nothing */ }

  try {
    await access(shmFilePath);
    await unlink(shmFilePath);
  } catch { /* nothing */ }
}
