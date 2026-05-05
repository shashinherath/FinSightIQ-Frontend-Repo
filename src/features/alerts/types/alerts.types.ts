export type AlertType =
  | "PRICE_TARGET"
  | "PERCENT_MOVE"
  | "VOLUME_SPIKE"
  | "VOLATILITY_SPIKE"
  | "PREDICTION_HIGH_CONFIDENCE"
  | "SENTIMENT_SHIFT";

export interface AlertRule {
  id: string;
  name: string;
  type: AlertType;
  enabled: boolean;
  threshold?: number;
  symbol?: string;
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  category: string;
  priority: "low" | "medium" | "high";
  read: boolean;
  createdAt: number;
}
