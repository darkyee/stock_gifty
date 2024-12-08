export interface ExchangeRateResponse {
  rates: ExchangeRates;
  base: string;
  date: string;
}

export interface ExchangeRates {
  [currency: string]: number;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CRC';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CRC', symbol: '₡', label: 'Costa Rican Colón' },
];