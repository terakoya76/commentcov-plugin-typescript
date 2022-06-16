import {msleep, sleep} from './sleep';

describe('msleep', () => {
  test('standard', () => {
    const since = new Date().getTime();
    msleep(1000);
    const until = new Date().getTime();
    expect(until - since).toBeGreaterThanOrEqual(1000);
  });

  test('failed', () => {
    const since = new Date().getTime();
    msleep(100);
    const until = new Date().getTime();
    expect(until - since).not.toBeGreaterThanOrEqual(1000);
  });
});

describe('sleep', () => {
  test('standard', () => {
    const since = new Date().getTime();
    sleep(1);
    const until = new Date().getTime();
    expect(until - since).toBeGreaterThanOrEqual(1000);
  });

  test('failed', () => {
    const since = new Date().getTime();
    sleep(0.1);
    const until = new Date().getTime();
    expect(until - since).not.toBeGreaterThanOrEqual(1000);
  });
});
