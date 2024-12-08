import axios from 'axios';
import { ExchangeRateResponse, ExchangeRates } from '../types/currency';

const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CRC: 520.25,
};

class ExchangeRateService {
  private static instance: ExchangeRateService;
  private cache: Map<string, { rates: ExchangeRates; timestamp: number }>;
  private cacheTimeout = 3600000; // 1 hour in milliseconds

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService();
    }
    return ExchangeRateService.instance;
  }

  private isCacheValid(baseCurrency: string): boolean {
    const cached = this.cache.get(baseCurrency);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  async getRates(baseCurrency: string): Promise<ExchangeRates> {
    try {
      if (this.isCacheValid(baseCurrency)) {
        return this.cache.get(baseCurrency)!.rates;
      }

      const response = await axios.get<ExchangeRateResponse>(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );

      const rates = response.data.rates;
      this.cache.set(baseCurrency, {
        rates,
        timestamp: Date.now(),
      });

      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return FALLBACK_RATES;
    }
  }
}

export const exchangeRateService = ExchangeRateService.getInstance();