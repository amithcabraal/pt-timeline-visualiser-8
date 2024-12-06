import React from 'react';
import { Event } from '../types/Event';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  differenceInDays,
  addDays,
  subDays
} from 'date-fns';
import { getTimeWindow, TimeRange } from '../utils/timeWindow';
import { CalendarEventItem } from './CalendarEventItem';
import { DayView } from './DayView';

interface CalendarViewProps {
  events: Event[];
  focusDate: Date;
  timeRange: TimeRange;
  onEditEvent: (event: Event) => void;
}

export function CalendarView({ events, focusDate, timeRange, onEditEvent }: CalendarViewProps) {
  // For 1-day view, use the DayView component
  if (timeRange === '1day') {
    return <DayView events={events} focusDate={focusDate} onEditEvent={onEditEvent} />;
  }

  const { start: viewStart, end: viewEnd } = getTimeWindow(focusDate, timeRange);
  
  // For 3-day view, only show the relevant days
  if (timeRange === '3days') {
    const daysToShow = eachDayOfInterval({ start: viewStart, end: viewEnd });
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-3 gap-2">
          {daysToShow.map(day => {
            const dayEvents = events.filter(event => 
              isSameDay(event.startDate, day) || 
              isSameDay(event.endDate, day) ||
              (event.startDate <= day && event.endDate >= day)
            );

            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={`border rounded-lg p-2 ${
                  isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="text-center font-medium text-gray-700 mb-2">
                  {format(day, 'EEE, MMM d')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <CalendarEventItem
                      key={`${event.id}-${format(day, 'yyyy-MM-dd')}`}
                      event={event}
                      onDoubleClick={onEditEvent}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // For week view, ensure we show Sunday to Saturday
  if (timeRange === '1week') {
    const weekStart = startOfWeek(focusDate);
    const weekEnd = endOfWeek(focusDate);
    const daysToShow = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          {daysToShow.map(day => {
            const dayEvents = events.filter(event => 
              isSameDay(event.startDate, day) || 
              isSameDay(event.endDate, day) ||
              (event.startDate <= day && event.endDate >= day)
            );

            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={`border rounded-lg p-2 ${
                  isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="text-center font-medium text-gray-700 mb-2">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <CalendarEventItem
                      key={`${event.id}-${format(day, 'yyyy-MM-dd')}`}
                      event={event}
                      onDoubleClick={onEditEvent}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // For 2-week and month views
  const monthStart = startOfMonth(focusDate);
  const calendarStart = startOfWeek(viewStart);
  const calendarEnd = endOfWeek(viewEnd);

  const daysToShow = eachDayOfInterval({ 
    start: calendarStart,
    end: calendarEnd
  });

  const getEventsForDay = (day: Date) => 
    events.filter(event => 
      isSameDay(event.startDate, day) || 
      isSameDay(event.endDate, day) ||
      (event.startDate <= day && event.endDate >= day)
    );

  const isInSelectedRange = (day: Date) => {
    return day >= viewStart && day <= viewEnd;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-center mb-4">
          {format(focusDate, 'MMMM yyyy')}
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          {daysToShow.map(day => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isFocusDate = isSameDay(day, focusDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const inSelectedRange = isInSelectedRange(day);
            
            if (!inSelectedRange && !isCurrentMonth) {
              return <div key={format(day, 'yyyy-MM-dd')} className="h-32" />;
            }

            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={`border rounded-lg p-2 flex flex-col ${
                  isFocusDate ? 'ring-2 ring-blue-500' : ''
                } ${
                  isToday ? 'bg-blue-50' : 'bg-gray-50'
                } ${
                  !isCurrentMonth ? 'opacity-50' : ''
                } ${
                  !inSelectedRange ? 'opacity-25' : ''
                }`}
              >
                <div className="text-right mb-1 text-gray-700">
                  {format(day, 'd')}
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  {inSelectedRange && dayEvents.map(event => (
                    <CalendarEventItem
                      key={`${event.id}-${format(day, 'yyyy-MM-dd')}`}
                      event={event}
                      onDoubleClick={onEditEvent}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}