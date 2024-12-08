import React from 'react';
import { useTranslation } from 'react-i18next';

export type TimeRange = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  const { t } = useTranslation();

  const ranges: TimeRange[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'];

  return (
    <div className="flex gap-2 mb-4">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onRangeChange(range)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedRange === range
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
</boltArtifact>

<boltArtifact id="update-stock-chart" title="Update Stock Chart with Time Range Support">
<boltAction type="file" filePath="src/components/StockChart.tsx">
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, subDays, subMonths, subYears, startOfYear } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { StockData } from '../types';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';

interface StockChartProps {
  data: StockData[];
  purchasePrice: number;
  currency: string;
  formatCurrency: (value: number) => string;
}

export function StockChart({ data, purchasePrice, currency, formatCurrency }: StockChartProps) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');

  const getFilteredData = () => {
    const now = new Date();
    const filterDate = (() => {
      switch (timeRange) {
        case '1D':
          return subDays(now, 1);
        case '5D':
          return subDays(now, 5);
        case '1M':
          return subMonths(now, 1);
        case '6M':
          return subMonths(now, 6);
        case 'YTD':
          return startOfYear(now);
        case '1Y':
          return subYears(now, 1);
        case '5Y':
          return subYears(now, 5);
        case 'ALL':
          return new Date(0); // Return all data
        default:
          return subMonths(now, 6);
      }
    })();

    return data.filter(item => new Date(item.date) >= filterDate);
  };

  const filteredData = getFilteredData();
  const minValue = Math.min(...filteredData.map(d => d.price));
  const maxValue = Math.max(...filteredData.map(d => d.price));
  const valueRange = maxValue - minValue;
  const yAxisDomain = [
    minValue - (valueRange * 0.1),
    maxValue + (valueRange * 0.1)
  ];

  const getDateFormat = () => {
    switch (timeRange) {
      case '1D':
        return 'HH:mm';
      case '5D':
        return 'EEE HH:mm';
      case '1M':
        return 'MMM d';
      default:
        return 'MMM d, yyyy';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t('stockTracker.priceHistory')}</h3>
        <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), getDateFormat())}
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
                        {format(date, getDateFormat())}
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
                value: t('stockTracker.purchasePrice'),
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