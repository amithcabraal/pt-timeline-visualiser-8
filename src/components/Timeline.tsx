import React, { useState, useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { format, addDays } from 'date-fns';
import { TimelineControls } from './TimelineControls';
import { EventTable } from './EventTable';
import { Event } from '../types/Event';
import { CalendarView } from './CalendarView';
import { EditEventDialog } from './EditEventDialog';
import { TagFilter } from './TagFilter';
import { SearchFilter } from './SearchFilter';
import { TimelineView } from './views/TimelineView';
import { useEventFilters } from '../hooks/useEventFilters';
import { getTimeWindow, TimeRange } from '../utils/timeWindow';

export function Timeline() {
  const events = useEventStore((state) => state.events);
  const [timeRange, setTimeRange] = useState<TimeRange>('3days');
  const [view, setView] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { selectedTags, searchTerm, filteredEvents, handleTagSelect, setSearchTerm } = useEventFilters(events);
  const [focusDate, setFocusDate] = useState(() => {
    if (events.length > 0) {
      const latestEvent = events.reduce((latest, event) => 
        event.endDate > latest.endDate ? event : latest
      );
      return latestEvent.endDate;
    }
    return new Date();
  });

  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events.reduce((latest, event) => 
        event.endDate > latest.endDate ? event : latest
      );
      setFocusDate(latestEvent.endDate);
    }
  }, [events]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const { start, end } = getTimeWindow(focusDate, timeRange);
    const days = direction === 'next' ? 
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) :
      -Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    setFocusDate(current => addDays(current, days));
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  if (events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No events to display. Add some events to see them on the timeline.</p>
      </div>
    );
  }

  const renderFilters = () => (
    <div className="flex gap-4 flex-wrap">
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <TagFilter
        events={events}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />
    </div>
  );

  const renderView = () => {
    const { start: timelineStart, end: timelineEnd } = getTimeWindow(focusDate, timeRange);

    if (view === 'list') {
      return <EventTable onEditEvent={handleEditEvent} events={filteredEvents} />;
    }

    if (view === 'calendar') {
      return (
        <CalendarView 
          events={filteredEvents} 
          focusDate={focusDate}
          timeRange={timeRange}
          onEditEvent={handleEditEvent}
        />
      );
    }

    return (
      <TimelineView
        events={filteredEvents}
        timelineStart={timelineStart}
        timelineEnd={timelineEnd}
        onEditEvent={handleEditEvent}
      />
    );
  };

  return (
    <div className="space-y-4">
      <TimelineControls
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
        focusDate={focusDate}
        onFocusDateChange={setFocusDate}
      />
      
      {renderFilters()}
      {renderView()}

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          isOpen={true}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}