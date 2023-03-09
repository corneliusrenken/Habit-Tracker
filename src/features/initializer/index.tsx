import React, { useEffect, useState } from 'react';
import { Config } from '../../api/config/defaultConfig';
import App from '../app';
import Modal from '../modal';
import createSetDatabasePathModalGenerator from '../setDatabasePathModal';

export default function Initializer() {
  const [config, setConfig] = useState<Config>();
  const [databaseExists, setDatabaseExists] = useState<boolean>(false);

  useEffect(() => {
    if (!config) {
      (async () => {
        const c = await window.electron['get-config']();
        const dbExists = await window.electron['check-if-database-exists']();
        if (dbExists) {
          await window.electron['initialize-database']();
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
        forceOpen
        modal={createSetDatabasePathModalGenerator({
          placeholderPath: config.databaseDirectoryPath,
          onConfirm: async (path: string) => {
            await window.electron['update-config']({
              databaseDirectoryPath: path,
            });
            await window.electron['initialize-database']();
            setConfig((previousConfig) => {
              const newConfig = JSON.parse(JSON.stringify(previousConfig));
              newConfig.databaseDirectoryPath = path;
              return newConfig;
            });
            setDatabaseExists(true);
          },
        })}
      />
    );
  }

  return <App config={config} />;
}
