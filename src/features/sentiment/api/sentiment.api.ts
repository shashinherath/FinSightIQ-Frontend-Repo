import type {
  MarketSentiment,
  NewsArticle,
  SymbolSentiment,
} from "../types/sentiment.types";

const seedRandom = (seed = "seed") => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export async function getMarketSentiment(): Promise<MarketSentiment> {
  const rand = seedRandom("market");
  const sectors = [
    "Technology",
    "Financials",
    "Energy",
    "Healthcare",
    "Consumer",
  ];
  return new Promise((res) =>
    setTimeout(() => {
      res({
        overall: Math.round((rand() - 0.45) * 200),
        bullishRatio: Number((0.45 + rand() * 0.4).toFixed(2)),
        bearishRatio: Number((0.55 - rand() * 0.4).toFixed(2)),
        sectors: sectors.map((s) => ({
          sector: s,
          score: Math.round((rand() - 0.5) * 200),
          bullish: Math.floor(rand() * 120),
          bearish: Math.floor(rand() * 120),
        })),
      });
    }, 360),
  );
}

export async function getNewsFeed(options?: {
  symbol?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: NewsArticle[]; total: number }> {
  const rand = seedRandom(options?.symbol || "news");
  const count = options?.pageSize ?? 25;
  const items: NewsArticle[] = Array.from({ length: count }).map((_, i) => {
    const ts = Date.now() - Math.floor(rand() * 1000 * 60 * 60 * 24 * 7);
    const sentiment = Number(((rand() - 0.45) * 1.4).toFixed(2));
    const symbols =
      rand() > 0.6 ? ["AAPL"] : rand() > 0.4 ? ["MSFT"] : ["NVDA"];
    return {
      id: `news-${ts}-${i}`,
      title: `${symbols[0]} ${rand() > 0.5 ? "beats" : "misses"} estimates — AI analysis`,
      summary: "AI-scored sentiment and highlights summary",
      source: rand() > 0.5 ? "BloomTech" : "MarketFeed",
      publishedAt: ts,
      symbols,
      sentiment,
      impactScore: Math.round(rand() * 100),
      credibility: Math.round(60 + rand() * 40),
    };
  });

  return new Promise((res) =>
    setTimeout(() => res({ items, total: 1000 }), 240),
  );
}

export async function getSymbolSentiment(
  symbol: string,
): Promise<SymbolSentiment> {
  const rand = seedRandom(symbol);
  const now = Date.now();
  const trend = Array.from({ length: 30 }).map((_, i) => ({
    timestamp: now - (29 - i) * 24 * 60 * 60 * 1000,
    score: Math.round((rand() - 0.5) * 200),
  }));
  const recentArticles = (await getNewsFeed({ symbol, pageSize: 5 })).items;
  const positives = recentArticles.filter((a) => a.sentiment > 0).length;
  const negatives = recentArticles.filter((a) => a.sentiment < 0).length;

  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          symbol: symbol.toUpperCase(),
          score: Math.round((rand() - 0.5) * 200),
          positiveCount: positives,
          negativeCount: negatives,
          trend,
          recentArticles,
        }),
      260,
    ),
  );
}
