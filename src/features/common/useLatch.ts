import { useMemo, useRef } from 'react';

export default function useLatch<T>(
  initialValue: T,
  updater: (oldValue: T) => T,
) {
  const latchedValueRef = useRef<T>(initialValue);
  return useMemo(() => {
    latchedValueRef.current = updater(latchedValueRef.current);
    return latchedValueRef.current;
  }, [updater]);
}
