import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';

interface StockAssetsProps {
  stockSymbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  currency: string;
  formatCurrency: (value: number, currency: string) => string;
}

export function StockAssets({
  stockSymbol,
  shares,
  purchasePrice,
  currentPrice,
  purchaseDate,
  currency,
  formatCurrency,
}: StockAssetsProps) {
  const priceChange = ((currentPrice - purchasePrice) / purchasePrice) * 100;
  const totalValue = currentPrice * shares;
  const profitLoss = (currentPrice - purchasePrice) * shares;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              24h%
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Holdings
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg. Buy Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profit/Loss
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {stockSymbol.charAt(0)}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{stockSymbol}</div>
                  <div className="text-sm text-gray-500">{format(purchaseDate, 'MMM d, yyyy')}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
              {formatCurrency(currentPrice, currency)}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className="flex items-center justify-end gap-1">
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {priceChange.toFixed(2)}%
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
              <div>{formatCurrency(totalValue, currency)}</div>
              <div className="text-gray-500">{shares} shares</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
              {formatCurrency(purchasePrice, currency)}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
              profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <div>{formatCurrency(Math.abs(profitLoss), currency)}</div>
              <div>{(profitLoss / (purchasePrice * shares) * 100).toFixed(2)}%</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
              <button className="text-gray-400 hover:text-gray-500">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}