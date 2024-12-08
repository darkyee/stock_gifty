export interface Certificate {
  id: string;
  stockSymbol: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: Date;
  redeemDate: Date;
  currency: string;
  customCurrencySymbol?: string;
  walletAddress?: string;
  recipientName: string;
  senderName: string;
  message?: string;
  signatures: {
    sender?: string;
    recipient?: string;
    timestamp?: string;
    verificationCode?: string;
    enabled: boolean;
    customLabel?: string;
    senderLabel?: string;
    recipientLabel?: string;
  };
  qrCodes: {
    verification: {
      enabled: boolean;
      label?: string;
    };
    tracking: {
      enabled: boolean;
      label?: string;
    };
  };
  textConfig: {
    [key: string]: TextFieldConfig;
  };
}

export interface TextFieldConfig {
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  enabled: boolean;
  customLabel?: string;
  customSuffix?: string;
  priceLabel?: string;
  purchaseDateLabel?: string;
  redeemDateLabel?: string;
}

export interface StockData {
  date: string;
  price: number;
}