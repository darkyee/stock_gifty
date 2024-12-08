import { SupportedCurrency, SUPPORTED_CURRENCIES } from '../types/currency';

export function detectUserCountry(): string {
  try {
    const browserLocale = navigator.language;
    if (browserLocale) {
      const country = browserLocale.split('-')[1]?.toUpperCase();
      return country || 'US';
    }
  } catch (error) {
    console.error('Error detecting user country:', error);
  }
  return 'US';
}

export function getDefaultCurrency(country: string): SupportedCurrency {
  const currencyMap: { [key: string]: SupportedCurrency } = {
    CR: 'CRC',
    US: 'USD',
    GB: 'GBP',
    ES: 'EUR',
  };
  
  return currencyMap[country] || 'USD';
}

export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

export function getCurrencyInfo(currencyCode: string) {
  return SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
}