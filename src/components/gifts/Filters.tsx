import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  recipients: string[];
  selectedRecipient: string;
  onSelectRecipient: (recipient: string) => void;
}

export function Filters({ recipients, selectedRecipient, onSelectRecipient }: FiltersProps) {
  return (
    <div className="relative">
      <select
        value={selectedRecipient}
        onChange={(e) => onSelectRecipient(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">All Recipients</option>
        {recipients.map(recipient => (
          <option key={recipient} value={recipient}>
            {recipient}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Filter className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}