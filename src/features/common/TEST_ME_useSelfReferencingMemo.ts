import { useMemo, useRef } from 'react';

export default function useSelfReferencingMemo<T>(
  initialValue: T,
  callback: (previousValue: T) => T,
) {
  const ref = useRef<T>(initialValue);
  const memoizedValue = useMemo(() => {
    const result = callback(ref.current);
    ref.current = result;
    return result;
  }, [callback]);

  return memoizedValue;
}
