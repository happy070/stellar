/**
 * Simulated network client.
 *
 * Every "endpoint" resolves through `request()` which mimics real-world
 * latency and occasional failure so the UI's loading / error / empty states
 * are exercised against realistic timing rather than instant resolves.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  /** Artificial latency window in ms; a random value in [min, max] is used. */
  delay?: [min: number, max: number];
  /** Probability (0..1) the request rejects, to exercise error states. */
  failureRate?: number;
}

const DEFAULTS: Required<RequestOptions> = {
  delay: [600, 1200],
  failureRate: 0,
};

function randomBetween(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

/**
 * Resolves `data` after a randomized delay, or rejects with an ApiError
 * based on `failureRate`. The producer is a function so we only build the
 * payload once we've "reached the server".
 */
export function request<T>(produce: () => T, options: RequestOptions = {}): Promise<T> {
  const { delay, failureRate } = { ...DEFAULTS, ...options };
  const [min, max] = delay;

  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new ApiError('Something went wrong. Please try again.', 503));
        return;
      }
      try {
        resolve(produce());
      } catch (err) {
        reject(
          new ApiError(err instanceof Error ? err.message : 'Unexpected error', 500),
        );
      }
    }, randomBetween(min, max));
  });
}
