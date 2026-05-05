import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getMarketSentiment,
  getNewsFeed,
  getSymbolSentiment,
} from "../api/sentiment.api";
import type {
  MarketSentiment,
  NewsArticle,
  SymbolSentiment,
} from "../types/sentiment.types";

export const useMarketSentiment = () =>
  useQuery<MarketSentiment>({
    queryKey: ["sentiment", "market"],
    queryFn: getMarketSentiment,
    staleTime: 1000 * 30,
  });

export const useNewsFeed = (params?: { symbol?: string; page?: number }) =>
  useQuery<{ items: NewsArticle[]; total: number }>({
    queryKey: ["sentiment", "news", params],
    queryFn: () => getNewsFeed(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 20,
  });

export const useSymbolSentiment = (symbol?: string) =>
  useQuery<SymbolSentiment>({
    queryKey: ["sentiment", "symbol", symbol],
    queryFn: () => getSymbolSentiment(symbol!),
    enabled: !!symbol,
  });
