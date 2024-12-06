import React from 'react';
import { Tag } from 'lucide-react';
import { Event } from '../types/Event';

interface TagFilterProps {
  events: Event[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function TagFilter({ events, selectedTags, onTagSelect }: TagFilterProps) {
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    events.forEach(event => {
      event.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [events]);

  if (allTags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2">
      <Tag className="w-4 h-4 text-gray-500" />
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}