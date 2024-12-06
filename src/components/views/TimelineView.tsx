import React from 'react';
import { format } from 'date-fns';
import { Event } from '../../types/Event';
import { EventItem } from '../EventItem';
import { generateTimeLabels } from '../../utils/timelineUtils';
import { calculateEventLayouts } from '../../utils/eventLayout';

interface TimelineViewProps {
  events: Event[];
  timelineStart: Date;
  timelineEnd: Date;
  onEditEvent: (event: Event) => void;
}

export function TimelineView({ events, timelineStart, timelineEnd, onEditEvent }: TimelineViewProps) {
  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
  const lanes = [...new Set(events.map((event) => event.lane))];
  const timeLabels = generateTimeLabels(timelineStart, timelineEnd);
  const layoutEvents = calculateEventLayouts(events, timelineStart, timelineEnd);

  const getLabelStyle = (date: Date) => ({
    left: `${((date.getTime() - timelineStart.getTime()) / totalDuration) * 100}%`,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Timeline Header */}
        <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
          <div className="font-medium text-gray-700">Lanes</div>
          <div className="relative h-14 border-b border-gray-200">
            {timeLabels.map((label, index) => (
              <div
                key={`${label.date.getTime()}-${index}`}
                className="absolute -bottom-1 transform -translate-x-1/2 flex flex-col items-center"
                style={getLabelStyle(label.date)}
              >
                <div className="h-2 w-px bg-gray-300" />
                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                  {label.showDate && (
                    <>
                      {format(label.date, 'MMM d, yyyy')}<br />
                    </>
                  )}
                  {format(label.date, label.format)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lanes and Events */}
        {lanes.map((lane) => (
          <div key={`lane-${lane}`} className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <div className="py-2 font-medium text-gray-700">{lane}</div>
            <div className="relative bg-gray-50 rounded" style={{ height: '8rem' }}>
              {/* Vertical gridlines */}
              {timeLabels.map((label, index) => (
                <div
                  key={`gridline-${label.date.getTime()}-${index}`}
                  className="absolute top-0 bottom-0 w-px bg-gray-100"
                  style={getLabelStyle(label.date)}
                />
              ))}
              
              {/* Events */}
              {layoutEvents
                .filter((event) => event.lane === lane)
                .map((event) => {
                  const left = ((event.startDate.getTime() - timelineStart.getTime()) / totalDuration) * 100;
                  const width = ((event.endDate.getTime() - event.startDate.getTime()) / totalDuration) * 100;
                  const height = 2; // rem
                  const verticalPadding = 0.25; // rem

                  return (
                    <EventItem
                      key={`${event.id}-${event.verticalOffset}`}
                      event={event}
                      onDoubleClick={onEditEvent}
                      style={{
                        left: `${Math.max(0, Math.min(100, left))}%`,
                        width: `${Math.max(0.5, Math.min(100, width))}%`,
                        height: `${height}rem`,
                        top: `${(height + verticalPadding) * event.verticalOffset}rem`,
                        display: left > 100 || left + width < 0 ? 'none' : 'flex',
                      }}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}