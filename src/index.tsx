import React from 'react';
import ReactDOM from 'react-dom/client';
import ConfigLoader from './features/configLoader';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './features/errorFallback';
import './styles/index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ConfigLoader />
    </ErrorBoundary>
  </React.StrictMode>
);
