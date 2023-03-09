/* eslint-disable @typescript-eslint/naming-convention */
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { getConfig } from '../../config/functions';
import openDatabase from '../../database/functions/common/openDatabase';
import createTables from '../../database/functions/common/createTables';
import { setDatabaseIpcHandlers } from '../../database';

export default async function initializeDatabase() {
  const {
    databaseDirectoryPath,
    _databaseFolderName,
    _databaseFileName,
  } = await getConfig();

  await mkdir(join(databaseDirectoryPath, _databaseFolderName), { recursive: true });

  const databasePath = join(databaseDirectoryPath, _databaseFolderName, _databaseFileName);

  const database = openDatabase(databasePath);
  createTables(database);

  setDatabaseIpcHandlers(database);
}
