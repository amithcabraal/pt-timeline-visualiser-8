import React from 'react';
import { format } from 'date-fns';
import { Event } from '../types/Event';

interface CalendarEventItemProps {
  event: Event;
  onDoubleClick: (event: Event) => void;
}

export function CalendarEventItem({ event, onDoubleClick }: CalendarEventItemProps) {
  let backgroundColor;
  let textColor;
  switch (event.sentiment) {
    case 'positive':
      backgroundColor = '#dcfce7';
      textColor = '#166534';
      break;
    case 'negative':
      backgroundColor = '#fee2e2';
      textColor = '#991b1b';
      break;
    default:
      backgroundColor = '#dbeafe';
      textColor = '#1e40af';
  }

  return (
    <div
      className="group relative cursor-pointer border border-gray-400 rounded px-2 py-1"
      style={{ backgroundColor, color: textColor }}
      onDoubleClick={() => onDoubleClick(event)}
    >
      <div className="truncate">{event.title}</div>
      {/* Tooltip */}
      <div className="invisible group-hover:visible absolute left-0 top-full mt-1 z-10 w-64 p-2 bg-white rounded shadow-lg border text-gray-900">
        <div className="font-medium">{event.title}</div>
        <div className="text-xs text-gray-500">
          {format(event.startDate, 'MMM d, HH:mm')} - {format(event.endDate, 'MMM d, HH:mm')}
        </div>
        {event.description && (
          <div className="text-xs mt-1">{event.description}</div>
        )}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {event.tags.map(tag => (
              <span 
                key={`${event.id}-${tag}`}
                className="px-1.5 py-0.5 bg-gray-100 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}