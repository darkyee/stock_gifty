import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { exchangeRateService } from '../services/exchangeRates';
import { detectUserCountry, getDefaultCurrency } from '../utils/locale';
import type { SupportedCurrency } from '../types/currency';

export function useCurrency() {
  const userCountry = detectUserCountry();
  const defaultCurrency = getDefaultCurrency(userCountry);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(defaultCurrency);

  const { data: exchangeRates, isLoading } = useQuery({
    queryKey: ['exchangeRates', selectedCurrency],
    queryFn: () => exchangeRateService.getRates(selectedCurrency),
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 3,
  });

  const convertAmount = useCallback((
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (!exchangeRates || fromCurrency === toCurrency) return amount;
    
    try {
      // If converting from base currency
      if (fromCurrency === selectedCurrency) {
        return amount * (exchangeRates[toCurrency] || 1);
      }
      
      // If converting to base currency
      if (toCurrency === selectedCurrency) {
        return amount / (exchangeRates[fromCurrency] || 1);
      }
      
      // Converting between two non-base currencies
      const amountInBase = amount / (exchangeRates[fromCurrency] || 1);
      return amountInBase * (exchangeRates[toCurrency] || 1);
    } catch (error) {
      console.error('Error converting amount:', error);
      return amount;
    }
  }, [exchangeRates, selectedCurrency]);

  return {
    currency: selectedCurrency,
    setCurrency: setSelectedCurrency,
    exchangeRates,
    isLoading,
    convertAmount,
  };
}