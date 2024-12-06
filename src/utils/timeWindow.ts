import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export type TimeRange = '1day' | '3days' | '1week' | '2weeks' | '1month';

export function getTimeWindow(focusDate: Date, timeRange: TimeRange) {
  switch (timeRange) {
    case '1day':
      return {
        start: focusDate,
        end: focusDate
      };
    case '3days':
      return {
        start: subDays(focusDate, 1),
        end: addDays(focusDate, 1)
      };
    case '1week': {
      const weekStart = startOfWeek(focusDate);
      const weekEnd = endOfWeek(focusDate);
      return {
        start: weekStart,
        end: weekEnd
      };
    }
    case '2weeks': {
      const weekStart = startOfWeek(focusDate);
      return {
        start: weekStart,
        end: addDays(weekStart, 13)
      };
    }
    case '1month': {
      const monthStart = startOfMonth(focusDate);
      const monthEnd = endOfMonth(focusDate);
      return {
        start: monthStart,
        end: monthEnd
      };
    }
    default:
      return {
        start: subDays(focusDate, 1),
        end: addDays(focusDate, 1)
      };
  }
}

export const TIME_RANGE_DAYS = {
  '1day': 1,
  '3days': 3,
  '1week': 7,
  '2weeks': 14,
  '1month': 30,
} as const;