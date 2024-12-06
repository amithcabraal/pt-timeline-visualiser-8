import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SearchFilter({ searchTerm, onSearchChange }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow px-3 py-2">
      <Search className="w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events..."
        className="flex-1 border-none text-sm focus:ring-0 bg-transparent"
      />
    </div>
  );
}