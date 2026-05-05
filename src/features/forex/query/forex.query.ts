import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getForexDashboardData,
  getForexHistoricalRates,
  getForexMovers,
  getForexPairs,
  getLiveForexRate,
  searchForexPairs,
} from "../api/forex.api";
import type {
  ForexDashboardData,
  ForexHistoricalSeries,
  ForexPair,
  ForexQuote,
  ForexSearchResult,
  ForexTimeframe,
} from "../types/forex.types";

export const forexQueryKeys = {
  all: ["forex"] as const,
  dashboard: ["forex", "dashboard"] as const,
  pairs: ["forex", "pairs"] as const,
  movers: ["forex", "movers"] as const,
  quote: (pair: string) => ["forex", "quote", pair] as const,
  historical: (pair: string, timeframe: ForexTimeframe) =>
    ["forex", "historical", pair, timeframe] as const,
  search: (query: string) => ["forex", "search", query] as const,
};

export const useForexDashboard = () =>
  useQuery<ForexDashboardData>({
    queryKey: forexQueryKeys.dashboard,
    queryFn: getForexDashboardData,
    staleTime: 15 * 1000,
  });

export const useForexPairs = () =>
  useQuery<ForexPair[]>({
    queryKey: forexQueryKeys.pairs,
    queryFn: getForexPairs,
    staleTime: 5 * 60 * 1000,
  });

export const useForexMovers = () =>
  useQuery<ForexDashboardData>({
    queryKey: forexQueryKeys.movers,
    queryFn: getForexMovers,
    staleTime: 15 * 1000,
  });

export const useForexQuote = (pair: string, options?: { enabled?: boolean }) =>
  useQuery<ForexQuote>({
    queryKey: forexQueryKeys.quote(pair),
    queryFn: () => getLiveForexRate(pair),
    enabled: options?.enabled !== false && !!pair,
    refetchInterval: 800,
    staleTime: 500,
  });

export const useForexHistoricalRates = (
  pair: string,
  timeframe: ForexTimeframe,
  options?: { enabled?: boolean },
) =>
  useQuery<ForexHistoricalSeries>({
    queryKey: forexQueryKeys.historical(pair, timeframe),
    queryFn: () => getForexHistoricalRates(pair, timeframe),
    enabled: options?.enabled !== false && !!pair,
    staleTime: 30 * 1000,
  });

export const useForexSearchPairs = (
  query: string,
  limit = 10,
  options?: { enabled?: boolean; debounceMs?: number },
) => {
  const debounceMs = options?.debounceMs ?? 220;
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => window.clearTimeout(timer);
  }, [query, debounceMs]);

  return useQuery<ForexSearchResult[]>({
    queryKey: forexQueryKeys.search(debouncedQuery),
    queryFn: () => searchForexPairs(debouncedQuery, limit),
    enabled: options?.enabled !== false && debouncedQuery.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};
