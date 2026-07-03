import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: AsyncStatus;
  isLoading: boolean;
  /** True only while a pull-to-refresh is in flight (data already present). */
  isRefreshing: boolean;
  /** Re-run the async fn; pass `true` to flag it as a refresh. */
  refetch: (isRefresh?: boolean) => Promise<void>;
}

/**
 * Generic async-data hook. Owns the loading/error lifecycle so screens stay
 * declarative and never manage their own try/catch + flags. Guards against
 * setting state after unmount.
 *
 * `deps` re-runs the effect (e.g. a route param changing).
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: readonly unknown[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mountedRef = useRef(true);
  // Keep the latest fn without making it an effect dependency.
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setStatus('loading');
    setError(null);

    try {
      const result = await fnRef.current();
      if (!mountedRef.current) return;
      setData(result);
      setStatus('success');
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setStatus('error');
    } finally {
      if (mountedRef.current) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    isRefreshing,
    refetch: run,
  };
}
