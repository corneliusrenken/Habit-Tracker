/* eslint-disable @typescript-eslint/naming-convention */
import { join } from 'path';
import { access } from 'fs/promises';
import { getConfig } from '../../config/functions';

export default async function checkIfDatabaseExists() {
  const {
    databaseDirectoryPath,
    _databaseFolderName,
    _databaseFileName,
  } = await getConfig();

  const databaseFullPath = join(databaseDirectoryPath, _databaseFolderName, _databaseFileName);

  let databaseExists: boolean;
  try {
    await access(databaseFullPath);
    databaseExists = true;
  } catch {
    databaseExists = false;
  }
  return databaseExists;
}
