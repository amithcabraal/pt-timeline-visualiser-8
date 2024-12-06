import React from 'react';
import { Event } from '../types/Event';
import { format } from 'date-fns';
import { CalendarEventItem } from './CalendarEventItem';

interface DayViewProps {
  events: Event[];
  focusDate: Date;
  onEditEvent: (event: Event) => void;
}

export function DayView({ events, focusDate, onEditEvent }: DayViewProps) {
  const dayEvents = events.filter(event => 
    format(event.startDate, 'yyyy-MM-dd') === format(focusDate, 'yyyy-MM-dd') ||
    format(event.endDate, 'yyyy-MM-dd') === format(focusDate, 'yyyy-MM-dd') ||
    (event.startDate <= focusDate && event.endDate >= focusDate)
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-center mb-4">
        {format(focusDate, 'EEEE, MMMM d, yyyy')}
      </h2>
      <div className="space-y-2">
        {dayEvents.map(event => (
          <CalendarEventItem
            key={event.id}
            event={event}
            onDoubleClick={onEditEvent}
          />
        ))}
      </div>
    </div>
  );
}