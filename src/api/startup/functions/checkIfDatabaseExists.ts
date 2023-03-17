/* eslint-disable @typescript-eslint/naming-convention */
import { join } from 'path';
import { access } from 'fs/promises';
import { getConfig } from '../../config/functions';

export default async function checkIfDatabaseExists() {
  const {
    databaseDirectoryPath,
    _databaseFileName,
  } = await getConfig();

  const databaseFilePath = join(databaseDirectoryPath, _databaseFileName);

  let databaseExists: boolean;
  try {
    await access(databaseFilePath);
    databaseExists = true;
  } catch {
    databaseExists = false;
  }
  return databaseExists;
}
