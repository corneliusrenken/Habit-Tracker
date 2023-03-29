import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="error-fallback">
      <div>Error</div>
      {error instanceof Error && <div>{error.message}</div>}
      <button type="button" onClick={resetErrorBoundary}>Reload app</button>
    </div>
  );
}
