import { Event } from '../types/Event';

interface EventWithLayout extends Event {
  verticalOffset: number;
  totalOverlaps: number;
}

export function calculateEventLayouts(events: Event[], timelineStart: Date, timelineEnd: Date): EventWithLayout[] {
  const eventsByLane = events.reduce((acc, event) => {
    if (!acc[event.lane]) {
      acc[event.lane] = [];
    }
    acc[event.lane].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const layoutEvents: EventWithLayout[] = [];

  Object.values(eventsByLane).forEach(laneEvents => {
    const sortedEvents = [...laneEvents].sort((a, b) => 
      a.startDate.getTime() - b.startDate.getTime()
    );

    const overlappingGroups: Event[][] = [];
    let currentGroup: Event[] = [];

    sortedEvents.forEach(event => {
      if (currentGroup.length === 0) {
        currentGroup.push(event);
      } else {
        const overlapsWithGroup = currentGroup.some(groupEvent =>
          event.startDate < groupEvent.endDate && event.endDate > groupEvent.startDate
        );

        if (overlapsWithGroup) {
          currentGroup.push(event);
        } else {
          if (currentGroup.length > 0) {
            overlappingGroups.push([...currentGroup]);
          }
          currentGroup = [event];
        }
      }
    });
    
    if (currentGroup.length > 0) {
      overlappingGroups.push(currentGroup);
    }

    overlappingGroups.forEach(group => {
      group.forEach((event, index) => {
        layoutEvents.push({
          ...event,
          verticalOffset: index,
          totalOverlaps: group.length
        });
      });
    });
  });

  return layoutEvents;
}