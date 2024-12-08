import React from 'react';
import { StockChart } from './StockChart';
import { StockData } from '../types';

interface StockOverviewProps {
  data: StockData[];
  purchasePrice: number;
  currentPrice: number;
  shares: number;
  currency: string;
  formatCurrency: (value: number, currency: string) => string;
}

export function StockOverview({
  data,
  purchasePrice,
  currentPrice,
  shares,
  currency,
  formatCurrency,
}: StockOverviewProps) {
  return (
    <div className="space-y-6">
      <StockChart
        data={data}
        purchasePrice={purchasePrice}
        currency={currency}
        formatCurrency={(value) => formatCurrency(value, currency)}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Market Value</h3>
          <div className="text-2xl font-bold">
            {formatCurrency(currentPrice * shares, currency)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Return</h3>
          <div className="text-2xl font-bold">
            {formatCurrency((currentPrice - purchasePrice) * shares, currency)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Shares</h3>
          <div className="text-2xl font-bold">{shares}</div>
        </div>
      </div>
    </div>
  );
}