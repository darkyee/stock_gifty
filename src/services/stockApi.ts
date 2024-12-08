import axios from 'axios';
import { StockSymbol, StockQuote } from '../types/stock';

const API_KEY = 'R8EMGIL6U9BU9SXO'; // Replace with your Alpha Vantage API key
const BASE_URL = 'https://www.alphavantage.co/query';

export async function searchStockSymbols(query: string): Promise<StockSymbol[]> {
  if (!query) return [];
  
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: API_KEY,
      },
    });

    const matches = response.data.bestMatches || [];
    return matches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency'],
    }));
  } catch (error) {
    console.error('Error searching stock symbols:', error);
    return [];
  }
}

export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY,
      },
    });

    const quote = response.data['Global Quote'];
    if (!quote) return null;

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}