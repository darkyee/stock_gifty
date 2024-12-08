import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { Search } from 'lucide-react';
import { searchStockSymbols } from '../services/stockApi';
import type { StockSymbol } from '../types/stock';

interface StockSymbolSearchProps {
  value: string;
  onChange: (symbol: string) => void;
}

export function StockSymbolSearch({ value, onChange }: StockSymbolSearchProps) {
  const [search, setSearch] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: symbols = [], isLoading } = useQuery({
    queryKey: ['stockSymbols', debouncedSearch],
    queryFn: () => searchStockSymbols(debouncedSearch),
    enabled: debouncedSearch.length >= 1 && isEditing,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleSymbolSelect = useCallback((symbol: StockSymbol) => {
    setSearch(symbol.symbol);
    setIsEditing(false);
    onChange(symbol.symbol);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsEditing(true);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (search !== value) {
      setIsEditing(true);
    }
  }, [search, value]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search stock symbol (e.g., AAPL)"
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      {isEditing && debouncedSearch && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : symbols.length > 0 ? (
            <ul className="py-1">
              {symbols.map((symbol) => (
                <li
                  key={symbol.symbol}
                  onClick={() => handleSymbolSelect(symbol)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{symbol.symbol}</span>
                      <p className="text-sm text-gray-500">{symbol.name}</p>
                    </div>
                    <span className="text-xs text-gray-400">{symbol.region}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No matching symbols found
            </div>
          )}
        </div>
      )}
    </div>
  );
}