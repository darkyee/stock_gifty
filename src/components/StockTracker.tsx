import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { TrendingUp, TrendingDown, Calendar, Lock, Unlock, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/locale';
import { useCurrency } from '../hooks/useCurrency';
import { StockChart } from './StockChart';
import { StockOverview } from './StockOverview';
import { StockAssets } from './StockAssets';

interface StockTrackerProps {
  certificateId: string;
  stockSymbol: string;
  purchaseDate: Date;
  purchasePrice: number;
  shares: number;
  redeemDate: Date;
}

export function StockTracker({ 
  stockSymbol, 
  purchaseDate, 
  purchasePrice, 
  shares,
  redeemDate 
}: StockTrackerProps) {
  const { t } = useTranslation();
  const { currency, convertAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'transaction'>('overview');

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stockData', stockSymbol],
    queryFn: async () => {
      // Simulate API call
      const data = [];
      let price = purchasePrice;
      const days = differenceInDays(new Date(), purchaseDate);
      
      for (let i = 0; i <= days; i++) {
        const date = new Date(purchaseDate);
        date.setDate(date.getDate() + i);
        price = price * (1 + (Math.random() - 0.5) * 0.02);
        data.push({
          date: format(date, 'yyyy-MM-dd'),
          price: Number(price.toFixed(2)),
        });
      }
      
      return {
        currentPrice: price,
        priceChange: price - purchasePrice,
        priceChangePercent: ((price - purchasePrice) / purchasePrice) * 100,
        data,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stockData) return null;

  const currentPrice = convertAmount(stockData.currentPrice, 'USD', currency);
  const priceChange = convertAmount(stockData.priceChange, 'USD', currency);
  const totalValue = currentPrice * shares;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{stockSymbol}</h1>
            <div className="text-sm text-gray-500">Stock Certificate</div>
          </div>
        </div>
        
        <div className="flex items-baseline gap-4">
          <div className="text-3xl font-bold">
            {formatCurrency(currentPrice, currency)}
          </div>
          <div className={`flex items-center gap-1 ${
            priceChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-medium">
              {formatCurrency(Math.abs(priceChange), currency)} ({stockData.priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-1 relative ${
              activeTab === 'overview' 
                ? 'text-indigo-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('stockTracker.tabs.overview')}
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('transaction')}
            className={`py-3 px-1 relative ${
              activeTab === 'transaction' 
                ? 'text-indigo-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('stockTracker.tabs.transaction')}
            {activeTab === 'transaction' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <StockOverview
          data={stockData.data}
          purchasePrice={purchasePrice}
          currentPrice={currentPrice}
          shares={shares}
          currency={currency}
          formatCurrency={formatCurrency}
        />
      ) : (
        <StockAssets
          stockSymbol={stockSymbol}
          shares={shares}
          purchasePrice={purchasePrice}
          currentPrice={currentPrice}
          purchaseDate={purchaseDate}
          currency={currency}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}