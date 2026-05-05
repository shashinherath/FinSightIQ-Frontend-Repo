export interface SectorSentiment {
  sector: string;
  score: number; // -100..100
  bullish: number;
  bearish: number;
}

export interface MarketSentiment {
  overall: number; // -100..100
  bullishRatio: number; // 0..1
  bearishRatio: number; // 0..1
  sectors: SectorSentiment[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  source: string;
  publishedAt: number;
  symbols: string[];
  sentiment: number; // -1..1
  impactScore: number; // 0..100
  credibility: number; // 0..100
}

export interface SymbolSentiment {
  symbol: string;
  score: number; // -100..100
  positiveCount: number;
  negativeCount: number;
  trend: Array<{ timestamp: number; score: number }>;
  recentArticles: NewsArticle[];
}
