export interface StockSymbol {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  latestTradingDay: string;
}