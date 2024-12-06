import React from 'react';
import { format } from 'date-fns';
import { Event } from '../types/Event';

interface EventItemProps {
  event: Event & { verticalOffset?: number; totalOverlaps?: number };
  style?: React.CSSProperties;
  onDoubleClick: (event: Event) => void;
}

export function EventItem({ event, style, onDoubleClick }: EventItemProps) {
  const getSentimentColors = (sentiment: Event['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return { bg: '#dcfce7', text: '#166534' };
      case 'negative':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#dbeafe', text: '#1e40af' };
    }
  };

  const { bg, text } = getSentimentColors(event.sentiment);

  return (
    <div
      className="absolute rounded px-2 text-sm flex items-center overflow-hidden whitespace-nowrap cursor-pointer group border border-gray-400"
      style={{ ...style, backgroundColor: bg, color: text }}
      onDoubleClick={() => onDoubleClick(event)}
      title={`${event.title}\n${format(event.startDate, 'MMM d, yyyy HH:mm')} - ${format(
        event.endDate,
        'MMM d, yyyy HH:mm'
      )}\n${event.description || ''}`}
    >
      <span className="truncate">{event.title}</span>
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
                key={`${event.id}-tag-${tag}`}
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