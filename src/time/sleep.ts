/**
 * sleep implementation for node-js.
 * @param {number} n - micro seconds to be slept.
 */
export function msleep(n: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

/**
 * sleep implementation for node-js.
 * @param {number} n - seconds to be slept.
 */
export function sleep(n: number): void {
  msleep(n * 1000);
}
