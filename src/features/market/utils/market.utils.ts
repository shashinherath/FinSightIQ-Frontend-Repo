/**
 * Market Data Utilities and Formatting Functions
 */

/**
 * Format currency value
 */
export const formatCurrency = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format large numbers (K, M, B, T)
 */
export const formatNumber = (value: number, decimals = 2): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(decimals) + "T";
  } else if (absValue >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(decimals) + "B";
  } else if (absValue >= 1_000_000) {
    return (value / 1_000_000).toFixed(decimals) + "M";
  } else if (absValue >= 1_000) {
    return (value / 1_000).toFixed(decimals) + "K";
  }

  return value.toFixed(decimals);
};

/**
 * Format percentage change
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  const sign = value >= 0 ? "+" : "";
  return sign + value.toFixed(decimals) + "%";
};

/**
 * Get color based on value direction (positive/negative)
 */
export const getPriceChangeColor = (
  value: number,
): "green" | "red" | "neutral" => {
  if (value > 0) return "green";
  if (value < 0) return "red";
  return "neutral";
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number,
): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

/**
 * Format market cap
 */
export const formatMarketCap = (marketCap: number | undefined): string => {
  if (!marketCap) return "N/A";
  return "$" + formatNumber(marketCap);
};

/**
 * Format volume
 */
export const formatVolume = (volume: number | undefined): string => {
  if (!volume) return "N/A";
  return formatNumber(volume, 1).toUpperCase();
};

/**
 * Format PE ratio
 */
export const formatPERatio = (pe: number | undefined): string => {
  if (!pe) return "N/A";
  return pe.toFixed(2);
};

/**
 * Format EPS
 */
export const formatEPS = (eps: number | undefined): string => {
  if (!eps) return "N/A";
  return "$" + eps.toFixed(2);
};

/**
 * Format dividend yield
 */
export const formatDividendYield = (yield_: number | undefined): string => {
  if (!yield_) return "N/A";
  return yield_.toFixed(2) + "%";
};

/**
 * Get market status color
 */
export const getMarketStatusColor = (
  status: string,
): "green" | "yellow" | "red" | "gray" => {
  switch (status) {
    case "OPEN":
      return "green";
    case "PRE_MARKET":
    case "AFTER_HOURS":
      return "yellow";
    case "CLOSED":
      return "gray";
    default:
      return "gray";
  }
};

/**
 * Get market status label
 */
export const getMarketStatusLabel = (status: string): string => {
  return status.replace(/_/g, " ");
};

/**
 * Calculate OHLC candlestick body color
 */
export const getCandleColor = (
  open: number,
  close: number,
): "green" | "red" => {
  return close >= open ? "green" : "red";
};

/**
 * Check if market is open
 */
export const isMarketOpen = (status: string): boolean => {
  return status === "OPEN";
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (
  timestamp: number,
  format: "short" | "long" = "short",
): string => {
  const date = new Date(timestamp);
  return format === "short" ? date.toLocaleDateString() : date.toLocaleString();
};

/**
 * Calculate price target based on current price and target percentage
 */
export const calculatePriceTarget = (
  currentPrice: number,
  percentageChange: number,
): number => {
  return currentPrice + currentPrice * (percentageChange / 100);
};

/**
 * Calculate support/resistance levels
 */
export const calculateSupportResistance = (
  high: number,
  low: number,
  close: number,
): { support: number; resistance: number; pivot: number } => {
  const pivot = (high + low + close) / 3;
  const support = 2 * pivot - high;
  const resistance = 2 * pivot - low;

  return { pivot, support, resistance };
};

/**
 * Calculate RSI (Relative Strength Index)
 * Note: This is a simplified version. For production, use a proper TA library
 */
export const calculateRSI = (prices: number[], period = 14): number => {
  if (prices.length < period + 1) return 50;

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains = changes
    .slice(-period)
    .filter((c) => c > 0)
    .reduce((a, b) => a + b, 0);
  const losses = Math.abs(
    changes
      .slice(-period)
      .filter((c) => c < 0)
      .reduce((a, b) => a + b, 0),
  );

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / (avgLoss === 0 ? 1 : avgLoss);
  const rsi = 100 - 100 / (1 + rs);

  return rsi;
};

/**
 * Classify RSI value
 */
export const classifyRSI = (
  rsi: number,
): "overbought" | "oversold" | "neutral" => {
  if (rsi >= 70) return "overbought";
  if (rsi <= 30) return "oversold";
  return "neutral";
};

/**
 * Get RSI color
 */
export const getRSIColor = (rsi: number): "red" | "orange" | "green" => {
  const classification = classifyRSI(rsi);
  if (classification === "overbought") return "red";
  if (classification === "oversold") return "orange";
  return "green";
};
