import { formatEventDate, formatEventTime, formatFullEventDate } from './date';

const boundaryInstant = '2026-09-02T00:30:00.000Z';
const nativeDateTimeFormat = Intl.DateTimeFormat;

beforeEach(() => {
  jest.spyOn(Intl, 'DateTimeFormat').mockImplementation((locale, options = {}) => (
    new nativeDateTimeFormat(locale, {
      ...options,
      timeZone: options.timeZone ?? 'Asia/Tokyo',
    })
  ));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('formats an event date in Ann Arbor time when the device is elsewhere', () => {
  expect(formatEventDate(boundaryInstant)).toBe('Tue, Sep 1');
});

test('formats an event time in Ann Arbor time when the device is elsewhere', () => {
  expect(formatEventTime(boundaryInstant, boundaryInstant)).toBe('8:30 PM - 8:30 PM');
});

test('combines the Ann Arbor date and time for the full event date', () => {
  expect(formatFullEventDate(boundaryInstant, boundaryInstant)).toBe('Tue, Sep 1 · 8:30 PM - 8:30 PM');
});
