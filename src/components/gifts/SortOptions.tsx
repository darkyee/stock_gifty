import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortOptionsProps {
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'date' | 'name') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}

export function SortOptions({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortOptionsProps) {
  return (
    <div className="flex gap-2">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as 'date' | 'name')}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="date">Sort by Date</option>
        <option value="name">Sort by Name</option>
      </select>
      
      <button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
      >
        <ArrowUpDown className="w-5 h-5" />
      </button>
    </div>
  );
}