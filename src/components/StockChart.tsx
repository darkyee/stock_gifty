import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { StockData } from '../types';

interface StockChartProps {
  data: StockData[];
  purchasePrice: number;
  currency: string;
  formatCurrency: (value: number) => string;
}

export function StockChart({ data, purchasePrice, currency, formatCurrency }: StockChartProps) {
  const { t } = useTranslation();

  const minValue = Math.min(...data.map(d => d.price));
  const maxValue = Math.max(...data.map(d => d.price));
  const valueRange = maxValue - minValue;
  const yAxisDomain = [
    minValue - (valueRange * 0.1),
    maxValue + (valueRange * 0.1)
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">{t('stockTracker.priceHistory')}</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              domain={yAxisDomain}
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
              width={80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const price = payload[0].value as number;
                  const date = new Date(label);
                  const percentChange = ((price - purchasePrice) / purchasePrice) * 100;

                  return (
                    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        {format(date, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(price)}
                      </p>
                      <p className={`text-sm ${
                        percentChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={purchasePrice}
              stroke="#9ca3af"
              strokeDasharray="3 3"
              label={{
                value: 'Purchase Price',
                position: 'right',
                fill: '#6b7280',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                stroke: '#4f46e5',
                strokeWidth: 2,
                fill: '#ffffff'
              }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}