import { useState, useMemo } from 'react';
import { Event } from '../types/Event';

export function useEventFilters(events: Event[]) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesTags = selectedTags.length === 0 || 
        event.tags?.some(tag => selectedTags.includes(tag));
      
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTags && matchesSearch;
    });
  }, [events, selectedTags, searchTerm]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(current =>
      current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag]
    );
  };

  return {
    selectedTags,
    searchTerm,
    filteredEvents,
    handleTagSelect,
    setSearchTerm
  };
}