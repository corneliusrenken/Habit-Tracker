import React, { useEffect, useState } from 'react';
import { Config } from '../../api/config/functions/common/initializeConfig'
import App from '../app';
import Modal from '../modal';
import createSetDatabasePathModalGenerator from '../setDatabasePathModal';

export default function Wrapper() {
  const [config, setConfig] = useState<Config>();
  const [databaseExists, setDatabaseExists] = useState<boolean>(false);

  useEffect(() => {
    if (!config) {
      (async () => {
        const c = await window.electron['get-config']();
        const dbExists = await window.electron['check-database-exists'](c.databaseDirectoryPath);
        if (dbExists) {
          await window.electron['open-database'](c.databaseDirectoryPath);
        }
        setConfig(c);
        setDatabaseExists(dbExists);
      })();
    }
  }, [config]);

  if (!config) return null;

  if (!databaseExists) {
    return (
      <Modal
        modal={createSetDatabasePathModalGenerator({
          placeholderPath: config.databaseDirectoryPath,
          onConfirm: async (path: string) => {
            await window.electron['update-config']({
              databaseDirectoryPath: path,
            });
            await window.electron['open-database'](path);
            setConfig((previousConfig) => {
              const newConfig = JSON.parse(JSON.stringify(previousConfig));
              newConfig.databaseDirectoryPath = path;
              return newConfig;
            });
            setDatabaseExists(true);
          },
        })}
        setModal={() => {}}
      />
    );
  }

  return <App config={config} />;
}
