/* eslint-disable no-underscore-dangle */
import {
  access,
  unlink,
} from 'fs/promises';
import { readFile, writeFile } from 'atomically';
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

  await writeFile(newDatabaseFilePath, await readFile(oldDatabaseFilePath));

  const database = openDatabase(newDatabaseFilePath);
  setDatabaseIpcHandlers(database);

  await unlink(oldDatabaseFilePath);

  // files from pragma are sometimes not cleaned up
  const walFilePath = `${oldDatabaseFilePath}-wal`;
  const shmFilePath = `${oldDatabaseFilePath}-shm`;

  let walFileExists = false;
  let shmFileExists = false;

  try {
    await access(walFilePath);
    walFileExists = true;
  } catch { /* nothing */ }

  try {
    await access(shmFilePath);
    shmFileExists = true;
  } catch { /* nothing */ }

  if (walFileExists) {
    await unlink(walFilePath);
  }
  if (shmFileExists) {
    await unlink(shmFilePath);
  }
}
