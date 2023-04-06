import { createContext } from 'react';
import { Config } from '../../api/config/defaultConfig';
import tempDefaultConfig from './tempDefaultConfig';

const ConfigContext = createContext<Config>(tempDefaultConfig);

export default ConfigContext;
