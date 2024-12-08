import React from 'react';
import { Certificate } from '../../types';
import { GiftCard } from './GiftCard';
import { Search } from './Search';
import { Filters } from './Filters';
import { SortOptions } from './SortOptions';

interface GiftListProps {
  gifts: Certificate[];
  onDeleteGift: (id: string) => void;
  onViewDetails: (gift: Certificate) => void;
}

export function GiftList({ gifts, onDeleteGift, onViewDetails }: GiftListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [selectedRecipient, setSelectedRecipient] = React.useState<string>('');

  const recipients = React.useMemo(() => {
    const uniqueRecipients = new Set(gifts.map(gift => gift.recipientName));
    return Array.from(uniqueRecipients);
  }, [gifts]);

  const filteredAndSortedGifts = React.useMemo(() => {
    return gifts
      .filter(gift => {
        const matchesSearch = searchTerm === '' || 
          gift.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gift.stockSymbol.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRecipient = selectedRecipient === '' || 
          gift.recipientName === selectedRecipient;

        return matchesSearch && matchesRecipient;
      })
      .sort((a, b) => {
        const compareValue = sortBy === 'date'
          ? new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
          : a.recipientName.localeCompare(b.recipientName);
        
        return sortOrder === 'asc' ? compareValue : -compareValue;
      });
  }, [gifts, searchTerm, selectedRecipient, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Search value={searchTerm} onChange={setSearchTerm} />
        <div className="flex gap-4">
          <Filters
            recipients={recipients}
            selectedRecipient={selectedRecipient}
            onSelectRecipient={setSelectedRecipient}
          />
          <SortOptions
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedGifts.map(gift => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onDelete={onDeleteGift}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {filteredAndSortedGifts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No gifts found matching your criteria</p>
        </div>
      )}
    </div>
  );
}