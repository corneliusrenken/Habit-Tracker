// always cancel intervals after each test
// always cancel intervals after each test
// always cancel intervals after each test

import onDateChange from '../../../features/onDateChange/onDateChange';

jest.useFakeTimers();

const mockCallback = jest.fn();
let cancelInterval: () => void;

beforeEach(() => {
  jest.setSystemTime(new Date(2023, 1, 21, 23, 59, 59, 500));
  mockCallback.mockReset();
});

afterEach(() => {
  cancelInterval();
});

test('executes callback when the setInterval fires and the date has changed from the time the function was called ', () => {
  cancelInterval = onDateChange('2023-02-21', mockCallback);
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1000);
  expect(mockCallback).toBeCalledTimes(1);
});

test('returns a function that when called, cancels the scheduled callback', () => {
  cancelInterval = onDateChange('2023-02-21', mockCallback);
  expect(mockCallback).not.toHaveBeenCalled();
  cancelInterval();
  jest.advanceTimersByTime(1000);
  expect(mockCallback).not.toHaveBeenCalled();
});

test('when the date changes and the callback is executed, the new date is stored and the callback is not executed again until the date changes once again', () => {
  cancelInterval = onDateChange('2023-02-21', mockCallback);
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1000); // 2023-02-22 00:00:00:500
  expect(mockCallback).toBeCalledTimes(1);
  jest.advanceTimersByTime(1000); // 2023-02-22 00:00:01:500
  expect(mockCallback).toBeCalledTimes(1);
  jest.setSystemTime(new Date(2023, 1, 22, 23, 59, 58, 500));
  jest.advanceTimersByTime(1000); // 2023-02-22 23:59:59:500
  expect(mockCallback).toBeCalledTimes(1);
  jest.advanceTimersByTime(1000); // 2023-02-23 00:00:00:500
  expect(mockCallback).toBeCalledTimes(2);
});

test('when system time changes, only executes callback when the date changes', () => {
  cancelInterval = onDateChange('2023-02-21', mockCallback);
  expect(mockCallback).not.toHaveBeenCalled();
  jest.setSystemTime(new Date(2023, 1, 21, 12, 59, 59, 500));
  jest.advanceTimersByTime(1000); // 2023-02-21 12:00:00:500
  expect(mockCallback).not.toHaveBeenCalled();
  jest.setSystemTime(new Date(2023, 1, 21, 16, 59, 59, 500));
  jest.advanceTimersByTime(1000); // 2023-02-21 16:00:00:500
  expect(mockCallback).not.toHaveBeenCalled();
  jest.setSystemTime(new Date(2023, 1, 21, 23, 59, 59, 500));
  jest.advanceTimersByTime(1000); // 2023-02-22 00:00:00:500
  expect(mockCallback).toBeCalledTimes(1);
});

test('accepts a time in millisecond which determines how often the function checks for a changed date', () => {
  jest.setSystemTime(new Date(2023, 1, 21, 23, 59, 59, 900));
  cancelInterval = onDateChange('2023-02-21', mockCallback, 200);
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(200); // 2023-02-22 00:00:00:100
  expect(mockCallback).toBeCalledTimes(1);

  cancelInterval();

  mockCallback.mockReset();
  jest.setSystemTime(new Date(2023, 1, 21, 23, 59, 59, 900));
  cancelInterval = onDateChange('2023-02-21', mockCallback, 1000);
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(200); // 2023-02-22 00:00:00:100
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(800); // 2023-02-22 00:00:00:900
  expect(mockCallback).toBeCalledTimes(1);
});

test('when left empty, the default time between system-time-change checks is 1 second', () => {
  cancelInterval = onDateChange('2023-02-21', mockCallback, 1000);
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(999); // 2023-02-22 00:00:00:499
  expect(mockCallback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1); // 2023-02-22 00:00:00:500
  expect(mockCallback).toBeCalledTimes(1);
});
