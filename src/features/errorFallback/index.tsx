import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="error-fallback">
      <div className="container">
        <div className="title">Error:</div>
        {(error instanceof Error
          ? <div className="error-message">{error.message}</div>
          : <div className="error-message">Unknown error</div>
        )}
        <button type="button" onClick={resetErrorBoundary} className="reload-button">Reload app</button>
      </div>
    </div>
  );
}
